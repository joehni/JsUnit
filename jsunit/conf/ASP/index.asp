<%@ LANGUAGE="JScript" %>
<%
/*
JsUnit - a JUnit port for JavaScript
Copyright (C) 1999,2000,2001,2002 Joerg Schaible

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation in version 2 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA

Test suites built with JsUnit are derivative works derived from tested 
classes and functions in their production; they are not affected by this 
license.
*/
%>
<!--#include file="JsUnitHeader.inc" -->
<h2>Welcome</h2>

This is JsUnit running in an ASP engine.

<h2>Available Test Suites</h2>

Two server-side tests are available:

<ul>
<li>the <a href="samples.asp">default examples</a></li>
<li>the <a href="tests.asp">unit tests</a> for JsUnit itself</li>
</ul>

Both tests use the <code>&lt;!-- #include file --&gt;</code> directive.
Alternativly you might open the file and read and evaluating its content
directly.

</body>
</html>
