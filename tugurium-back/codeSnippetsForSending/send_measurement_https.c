// Code to send measurement to graphwl-api with https
// 
// Install dependencies: sudo apt-get install libssl-dev
// Compile: gcc -o send_measurements_https send_measurement_https.c -lssl -lcrypto

#include <netdb.h>
#include <arpa/inet.h>
#include <string.h>
#include <unistd.h>
#include <openssl/ssl.h>

const char *sensor = "TEST";
const char *hostname = "tugurium.herokuapp.com";
const char *token = "xxxx";
const char *ds18b20 = "/sys/bus/w1/devices/28-0000021ec953/w1_slave";
const int port = 443;
int debug = 0;

// open http connection and send data
void send_measurement(float);

// Create tcp socket
int create_socket();

// send data with sll connection
void send_data(float, SSL *);

// get value from sensor
float get_value();

void main() {
  float value;
  value = get_value();
  if (value != -99) {
    send_measurement(value);
  }
}

void send_measurement(float value) {
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
  if (server != 0) {
    if (debug) printf("Successfully made the TCP connection to: %s.\n", hostname);
  } else return;
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

void send_data(float value, SSL *ssl) {
  char *message_fmt = "POST /api/graphql HTTP/1.0\r\nContent-Type: application/json\r\nContent-Length: %i\r\nAuthorization: BEARER %s\r\n\r\n%s";
  char *content_fmt = "{ \"query\": \"%s\", \"variables\": { \"sensorName\": \"%s\", \"value\": \"%f\" }}\r\n";
  char *query = "mutation ($sensorName: String!, $value: String) {addMeasurement(sensorName: $sensorName, value: $value) {value}}";
  struct hostent *server;
  struct sockaddr_in serv_addr;
  int sockfd, bytes, sent, received, total;
  char message[1024], content[1024],response[4096];

  sprintf(content, content_fmt, query, sensor, value);
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
      if (bytes < 0)
          if (debug) printf("ERROR reading response from socket");
          break;
      if (bytes == 0)
          break;
      received+=bytes;
  } while (received < total);
  if (debug) printf("Response:\n%s\n",response);
}

float get_value() {
  FILE *fp;
  int i,c;
  char data[180],*ptr,temps[10];
  float tempf;

  tempf=-99;
  fp=fopen(ds18b20,"r");
  if (fp!=NULL) {
    i=0;
    while ((c=getc(fp))!=EOF) {
      data[i]=c;
      i++;
    }
    data[i]='\0';
    fclose(fp);

    if (strstr(data,"YES")!=NULL) {
      ptr=strstr(data,"t=");
      i=0;
      do {
        temps[i]=ptr[2+i];
        i++;
      } while ((temps[i-1]!='\0') && (i<8));
      temps[i]='\0';
      tempf=((float) atoi(temps)/1000);
    }
  }
  return tempf;
}