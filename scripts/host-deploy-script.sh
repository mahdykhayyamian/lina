sudo su -
cd /home/ec2-user/lina/tomcat
echo "shutting down tomcat..."
./apache-tomcat-8.5.11/bin/shutdown.sh
rm -rf *
cp /tmp/tomcat.zip .
echo "unzipping tomcat..."
unzip -q tomcat.zip
rm -rf tomcat.zip
echo "starting tomcat..."
./apache-tomcat-8.5.11/bin/startup.sh
echo "deployment successfully done!"
exit 0