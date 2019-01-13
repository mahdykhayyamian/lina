### Steps to set up locally on Mac OS

* Clone the project by running:
``git clone https://github.com/mahdykhayyamian/lina.git``

* Install npm
``brew install npm``

* Install Java
``brew cask install java``

* Download tomcat from https://tomcat.apache.org/download-90.cgi and copy it preferrably next to project folder.

* Go to the root of Lina project and open scripts/build.sh file and then modify the following variables according to your folder structure 
```
LINA_ROOT=${HOME}"/workspace/lina"
CATALINA_HOME=${HOME}"/workspace/apache-tomcat-9.0.14"
```
* Run the build script to build and start the server
```./scripts/build.sh```

* Point your browser to `http://localhost:8080/lina/whiteboard`
