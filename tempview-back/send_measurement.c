#include <stdio.h> 
#include <stdlib.h> 
#include <unistd.h> 
#include <string.h> 
#include <sys/socket.h> 
#include <netinet/in.h> 
#include <netdb.h> 

const int port = 4000;
const char *host = "localhost";
const char *sensor = "HDOW";
const char *token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNlbnNvciIsImlkIjoxLCJpYXQiOjE2NTEwNDY0OTN9.942e6l55Eh0y9nWwsdkS_s-q_6-EXeoGnDdsKp6vXho";
const char *ds18b20 = "/sys/bus/w1/devices/28-000005d9ad73/w1_slave";

void send_measurement(float value) {
    char *message_fmt = "POST /graphql HTTP/1.1\r\nContent-Type: application/json\r\nContent-Length: %i\r\nAuthorization: BEARER %s\r\n\r\n%s";
    char *content_fmt = "{ \"query\": \"%s\", \"variables\": { \"sensorName\": \"%s\", \"value\": \"%f\" }}\r\n";
    char *query = "mutation ($sensorName: String!, $value: String) {addMeasurement(sensorName: $sensorName, value: $value) {value}}";
    struct hostent *server;
    struct sockaddr_in serv_addr;
    int sockfd, bytes, sent, received, total;
    char message[1024],content[1024];

    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    server = gethostbyname(host);
    memset(&serv_addr,0,sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(port);
    memcpy(&serv_addr.sin_addr.s_addr,server->h_addr,server->h_length);
    connect(sockfd,(struct sockaddr *)&serv_addr,sizeof(serv_addr));

    sprintf(content,content_fmt,query,sensor,value);
    sprintf(message,message_fmt,strlen(content),token,content);

    total = strlen(message);
    sent = 0;
    do {
        bytes = write(sockfd,message+sent,total-sent);
        if (bytes == 0)
            break;
        sent+=bytes;
    } while (sent < total);

    close(sockfd);
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

void main() {
    float value;
    value = get_value();
    if (value!=-99) {
      send_measurement(value);
    }
}