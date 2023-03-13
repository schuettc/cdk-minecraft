FROM amazon/aws-cli

RUN yum install -y net-tools jq nmap-ncat && \
    yum clean all

COPY ./watchdog.sh .
RUN chmod +x ./watchdog.sh
ENTRYPOINT ["./watchdog.sh"]