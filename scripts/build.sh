#!/bin/bash

LINA_APP_NAME="lina"

function createDeployDirectoryStructure {
	echoGreen "createDeployDirectoryStructure"
	cd ${LINA_ROOT}
	mkdir deploy
	cd deploy
	mkdir WEB-INF
	cd WEB-INF
	mkdir classes
	cd ${LINA_ROOT}
	mkdir temp
}

function clearDeployDirectory {
	echoGreen "clearing deploy directory..."
	cd ${LINA_ROOT}
	rm -rf deploy
}

function clearTempDirectory {
	echoGreen "clearing deploy directory..."
	cd ${LINA_ROOT}
	rm -rf temp
}

function compileJavaFiles {
	echoGreen "compiling java files..."
	find ${LINA_ROOT}/src/server -name *.java > ${LINA_ROOT}/temp/java-files.txt
	javac -cp "${LINA_ROOT}/java-libs/*:${CATALINA_HOME}/lib/*" -d "${LINA_ROOT}/deploy/WEB-INF/classes" @${LINA_ROOT}/temp/java-files.txt
}

function copyLibs {
	cd ${LINA_ROOT}
	cp -r ${LINA_ROOT}/java-libs ${LINA_ROOT}/deploy/WEB-INF/lib
}

function addJSBundle {
	webpack
	cp ${LINA_ROOT}/temp/bundle.js  ${LINA_ROOT}/deploy
}

function copyWebContent {
	cd ${LINA_ROOT}
	cp -r ${LINA_ROOT}/src/client/* ${LINA_ROOT}/deploy
}

function deployToTomcat {
	echoGreen "deploying to tomcat..."
	cd ${CATALINA_HOME}/webapps
	rm -rf ${LINA_APP_NAME}
	cd ${LINA_ROOT}
	cp -r ${LINA_ROOT}/deploy ${CATALINA_HOME}/webapps
	cd ${CATALINA_HOME}/webapps
	mv deploy ${LINA_APP_NAME}
}

function startTomcat {

	if isTomcatRunning; then
		return
	fi

	echoGreen "starting tomcat..."
	cd ${CATALINA_HOME}/bin
	./startup.sh
}

function tailTomcatLogs {
	tail -f ${CATALINA_HOME}/logs/catalina.out
}

function echoGreen {
	tput setaf 2;
	echo $1
	tput setaf 7;
}

function isTomcatRunning {
	if [[ $(lsof -i :${TOMCAT_PORT} | grep "java") ]]; then
		# 0 = true
		echoGreen "tomcat is running"
		return 0
	fi

 	echoGreen "tomcat is not running"
 	# 1 = false
	return 1
}

function createWarFile {
	cd ${LINA_ROOT}/deploy
	jar -cvf ../${LINA_APP_NAME}.war *
}

clearDeployDirectory
clearTempDirectory
createDeployDirectoryStructure
copyLibs
compileJavaFiles
copyWebContent
addJSBundle
deployToTomcat
createWarFile
startTomcat
tailTomcatLogs
