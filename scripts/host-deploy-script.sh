sudo su -
cd /home/ec2-user/lina/tomcat
echo "shutting down tomcat..."
./apache-tomcat-9.0.14/bin/shutdown.sh
rm -rf *
cp /tmp/tomcat.zip .
echo "unzipping tomcat..."
unzip -q tomcat.zip
rm -rf tomcat.zip
echo "starting tomcat..."
./apache-tomcat-9.0.14/bin/startup.sh
echo "deployment successfully done!"
exit 0