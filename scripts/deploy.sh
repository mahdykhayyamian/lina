function echoGreen {
	tput setaf 2;
	echo $1
	tput setaf 7;
}

cd ${LINA_ROOT}
echoGreen "zipping tomcat..."
zip -q -r tomcat.zip ${CATALINA_HOME} tomcat.zip
echoGreen "copying tomcat.zip on lina host..."
scp -i /Users/khaymahd/workspace/pet/lina-host-keypair.pem tomcat.zip ec2-user@ec2-34-217-234-64.us-west-2.compute.amazonaws.com:/tmp
ssh -i /Users/khaymahd/workspace/pet/lina-host-keypair.pem ec2-user@ec2-34-217-234-64.us-west-2.compute.amazonaws.com "bash -s" < ./scripts/host-deploy-script.sh