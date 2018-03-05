function echoGreen {
	tput setaf 2;
	echo $1
	tput setaf 7;
}

cd ${LINA_ROOT}
mkdir -p temp
cd temp
cp -r ${CATALINA_HOME} .
tomcatFolder=${CATALINA_HOME##*/}
cd ${tomcatFolder}/conf
rm server.xml
cp ${LINA_ROOT}/scripts/server.xml .
cd ${LINA_ROOT}
echoGreen "zipping tomcat..."
cd temp
zip -q -r tomcat.zip ${tomcatFolder} 
echoGreen "copying tomcat.zip to lina host..."
scp -i /Users/khaymahd/workspace/pet/lina-host-keypair.pem tomcat.zip ec2-user@ec2-34-217-234-64.us-west-2.compute.amazonaws.com:/tmp
echoGreen "running rest of the deployment script on the host..."
cd ${LINA_ROOT}
ssh -i /Users/khaymahd/workspace/pet/lina-host-keypair.pem ec2-user@ec2-34-217-234-64.us-west-2.compute.amazonaws.com "bash -s" < ./scripts/host-deploy-script.sh