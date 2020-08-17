#!/bin/bash

LINA_ROOT=${HOME}"/workspace/lina"
CATALINA_HOME=${HOME}"/workspace/apache-tomcat-9.0.14"
TOMCAT_PORT=8080

env="DEV"

function determinEnv {
	for (( i=1; i<=$#; i++)); do
		j=$((i+1))
		if  [ ${!i} == "-env" ]
		then
			env=${!j}
		fi
	done

	echoGreen "Env set to ${env}"
}

function updateNodePackages() {
	npm install
}

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
	find ${LINA_ROOT}/web-app/server -name *.java > ${LINA_ROOT}/temp/java-files.txt
	javac -cp "${LINA_ROOT}/java-libs/*:${CATALINA_HOME}/lib/*" -d "${LINA_ROOT}/deploy/WEB-INF/classes" @${LINA_ROOT}/temp/java-files.txt || { echo 'Java compile failed' ; exit 1; }
}

function download-maven-dependencies {
	echoGreen "Downloding maven dependencies..."
	cd ${LINA_ROOT}
	mvn dependency:copy-dependencies -DoutputDirectory=./java-libs
}

function copyLibs {
	cd ${LINA_ROOT}
	cp -r ${LINA_ROOT}/java-libs ${LINA_ROOT}/deploy/WEB-INF/lib
}

function runPrettierOnJSfiles {
	echoGreen "Running prettier on client JS files"
	cd ${LINA_ROOT}/web-app/client
	${LINA_ROOT}/node_modules/.bin/prettier --write "**/*.js"	
}

function addJSBundles {
	cd ${LINA_ROOT}

	if [ ${env} == "prod" ]
	then
		echoGreen "packing for prod env"
		node_modules/.bin/webpack --config webpack.prod.config.js || { echo 'webpack failed' ; exit 1; }
	else
		echoGreen "packing for dev env"
		node_modules/.bin/webpack --config webpack.config.js || { echo 'webpack failed' ; exit 1; }
	fi
	cp ${LINA_ROOT}/temp/*.js  ${LINA_ROOT}/deploy
}

function addJSLibs {
	cp -r ${LINA_ROOT}/js-libs/*  ${LINA_ROOT}/deploy
}


function copyWebContent {
	cd ${LINA_ROOT}
	cp -r ${LINA_ROOT}/web-app/client/* ${LINA_ROOT}/deploy
}

function startTomcat {

	if isTomcatRunning; then
		shutDownTomcat
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

function shutDownTomcat {
	echoGreen "shutting down tomcat..."
	cd ${CATALINA_HOME}/bin
	pkill -9 -f tomcat
}

function createWarFile {
	cd ${LINA_ROOT}/deploy
	jar -cvf ./ROOT.war *
}

function copyWarFile {
	cd ${CATALINA_HOME}/webapps
	rm -rf ROOT
	cp ${LINA_ROOT}/deploy/ROOT.war .
}

determinEnv "$@"

function build {
	updateNodePackages
	clearDeployDirectory
	clearTempDirectory
	createDeployDirectoryStructure
	download-maven-dependencies
	copyLibs
	compileJavaFiles
	copyWebContent
	runPrettierOnJSfiles
	addJSBundles
	addJSLibs
	createWarFile
	copyWarFile
}

function run {
	startTomcat
	clearTempDirectory
	tailTomcatLogs
}

if  [ ${1} == "build" ]
then
	echoGreen "Going to build the project"
	build
elif [ ${1} == "run" ]
then
	echoGreen "Going to run tomcat locally"
	run
fi