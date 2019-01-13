### Steps to set up locally on Mac OS

1. Clone the project by running:
``git clone https://github.com/mahdykhayyamian/lina.git``

1. Install npm
``brew install npm``

1. Install Java
``brew cask install java``

1. download tomcat from https://tomcat.apache.org/download-90.cgi and copy it preferrably next to project folder.

1. Go to the root of Lina project and open scripts/build.sh file and then modify the following variables according to your folder structure

```
LINA_ROOT=${HOME}"/workspace/lina"
CATALINA_HOME=${HOME}"/workspace/apache-tomcat-9.0.14"
```
