<%@ LANGUAGE = "JScript" %>
<%

function load( var filename )
{
	var fs = new ActiveXObject( "Scripting.FileSystemObject" );
	var thisfile = fs.OpenTextFile( filename, 1, false );
}

%>
