<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<script src="/videdit.js" type="text/javascript"></script>
	</head>

	<body>
		<div>
			<div id="app-header">
			</div>
			<div id="videdit-app">
				<div id="video-container">
					<input type="file" accept="video/*" id="upload-video-button"/>
					<hr>
					<video controls id="video-tag">
					  <source id="video-source" media="all and (max-width:600px)">
					  	Your browser does not support the video tag.
					</video>
				</div>
			</div>
		</div>
	</body>
</html>
