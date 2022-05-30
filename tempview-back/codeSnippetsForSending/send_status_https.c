// Code to send switch status to graphwl-api with https
// 
// Install dependencies: sudo apt-get install libssl-dev
// Compile: gcc -o send_status_https send_status_https.c -lssl -lcrypto

#include <netdb.h>
#include <arpa/inet.h>
#include <string.h>
#include <unistd.h>
#include <openssl/ssl.h>

const char *sw = "HLIG";
const char *hostname = "tempview.vuorenkoski.fi";
const char *token = "xxx";
const int port = 443;
int debug = 0;

// open http connection and send mutation
void send_status(int);

// Create tcp socket
int create_socket();

// send mutation with sll connection
void send_data(int, SSL *);

void main() {
  send_status(0);
}

void send_status(int value) {
  X509 *cert = NULL;
  const SSL_METHOD *method;
  SSL_CTX *ctx;
  SSL *ssl;
  int server = 0;

  OpenSSL_add_all_algorithms();
  SSL_load_error_strings();

  BIO_new(BIO_s_file());
  if(SSL_library_init() < 0) {
    if (debug) printf("Could not initialize the OpenSSL library !\n");
    return;
  }

  method = SSLv23_client_method();
  if ( (ctx = SSL_CTX_new(method)) == NULL) {
    if (debug) printf("Unable to create a new SSL context structure.\n");
    return;
  }

  SSL_CTX_set_options(ctx, SSL_OP_NO_SSLv2);
  ssl = SSL_new(ctx);

  server = create_socket();
  if(server != 0) {
    if (debug) printf("Successfully made the TCP connection to: %s.\n", hostname);
  } else
    return;

  SSL_set_fd(ssl, server);

  if ( SSL_connect(ssl) != 1) {
    if (debug) printf("Error: Could not build a SSL session to: %s.\n", hostname);
    return;
  }

  cert = SSL_get_peer_certificate(ssl);
  if (cert == NULL) {
    if (debug) printf("Error: Could not get a certificate from: %s.\n", hostname);
    return;
  }

  send_data(value, ssl);

  SSL_free(ssl);
  close(server);
  SSL_CTX_free(ctx);
}

int create_socket() {
  int sockfd;
  char *tmp_ptr = NULL;
  struct hostent *host;
  struct sockaddr_in dest_addr;

  if ( (host = gethostbyname(hostname)) == NULL ) {
    if (debug) printf("Error: Cannot resolve hostname %s.\n",  hostname);
    return 0;
  }

  sockfd = socket(AF_INET, SOCK_STREAM, 0);
  dest_addr.sin_family=AF_INET;
  dest_addr.sin_port=htons(port);
  dest_addr.sin_addr.s_addr = *(long*)(host->h_addr);
  memset(&(dest_addr.sin_zero), '\0', 8);
  tmp_ptr = inet_ntoa(dest_addr.sin_addr);

  if ( connect(sockfd, (struct sockaddr *) &dest_addr, sizeof(struct sockaddr)) == -1) {
    if (debug) printf("Error: Cannot connect to host %s [%s] on port %d.\n",hostname, tmp_ptr, port);
    return 0;
  }

  return sockfd;
}

void send_data(int value, SSL *ssl) {
  char *message_fmt = "POST /api/graphql HTTP/1.0\r\nContent-Type: application/json\r\nContent-Length: %i\r\nAuthorization: BEARER %s\r\n\r\n%s";
  char *content_fmt = "{ \"query\": \"%s\", \"variables\": { \"name\": \"%s\", \"on\": %s }}\r\n";
  char *query = "mutation ($name: String!, $on: Boolean!) {setSwitchStatus(name: $name, on: $on) {on}}";
  struct hostent *server;
  struct sockaddr_in serv_addr;
  int sockfd, bytes, sent, received, total;
  char message[1024], content[1024],response[4096];
  if (value==0) sprintf(content, content_fmt, query, sw, "false");
    else sprintf(content, content_fmt, query, sw, "true");
  sprintf(message, message_fmt, strlen(content), token, content);

  if (debug) printf("sending data\n%s", message);

  total = strlen(message);
  sent = 0;
  do {
    bytes = SSL_write(ssl, message + sent, total - sent);
    if (bytes < 0) {
      if (debug) printf("ERROR reading response from socket\n");
      break;
    }
    if (bytes == 0)
      break;
    sent += bytes;
  } while (sent < total);

  memset(response,0,sizeof(response));
  total = sizeof(response)-1;
  received = 0;
  do {
      bytes = SSL_read(ssl,response+received,total-received);
      if (bytes < 0) {
        if (debug) printf("ERROR reading response from socket");
        break;
      }
      if (bytes == 0)
        break;
      received+=bytes;
  } while (received < total);
  if (debug) printf("Response:\n%s\n",response);
}
