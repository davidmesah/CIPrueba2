FROM jenkins/jenkins:lts

USER root
RUN apt-get update && \
    apt-get install -y docker.io sudo && \
    usermod -aG docker jenkins && \
    echo "jenkins ALL=NOPASSWD: ALL" >> /etc/sudoers

USER jenkins

