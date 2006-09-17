/*
 * Copyright (C) 2006 Jörg Schaible
 * Created on 16.09.2006 by Jörg Schaible
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package de.berlios.jsunit;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.EcmaError;
import org.mozilla.javascript.JavaScriptException;
import org.mozilla.javascript.Scriptable;

import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;


/**
 * Manage a JsUnit environment based on Rhino.
 * 
 * @author J&ouml;rg Schaible
 * @since upcoming
 */
public class JsUnitRhinoRunner {

    private Context context;
    private final Scriptable scope;
    private static final String jsUnit;
    static {
        final StringWriter writer = new StringWriter(250 * 1024);
        loadScriptFromResource("JsUtil.js", writer);
        loadScriptFromResource("JsUnit.js", writer);
        jsUnit = writer.toString();
        writer.flush();
    }

    private static void loadScriptFromResource(final String name, final Writer writer) {
        final InputStream is = JsUnitRhinoRunner.class.getResourceAsStream("/" + name);
        if (is != null) {
            try {
                final Reader reader = new InputStreamReader(is, "ISO-8859-1");
                IOUtils.copy(reader, writer);
            } catch (final UnsupportedEncodingException e) {
                throw new InternalError("Missing standard character set ISO-8859-1");
            } catch (final IOException e) {
                throw new InternalError("Cannot load resource " + name);
            } finally {
                IOUtils.closeQuietly(is);
            }
        } else {
            throw new InternalError("Cannot find resource " + name);
        }
    }

    /**
     * Constructs a JsUnitRhinoRunner. A JavaScript context is created and initialized with the
     * JsUnit code.
     * 
     * @throws JsUnitRuntimeException if the JavaScript code of JsUnit has errors.
     * @since upcoming
     */
    public JsUnitRhinoRunner() {
        context = Context.enter();
        scope = context.initStandardObjects(null, false);
        try {
            context.evaluateString(scope, jsUnit, "JsUnit", 1, null);
        } catch (final JavaScriptException e) {
            throw new JsUnitRuntimeException("Cannot evaluate JavaScript code of JsUnit", e);
        } finally {
            Context.exit();
        }
    }

    /**
     * Load additional code into the JavaScript context. The provided reader is read until
     * excaution and closed afterwards.
     * 
     * @param reader the reader providing the code
     * @param name an identifying name of the code (normally the file name)
     * @throws JsUnitException
     * @throws IOException
     * @since upcoming
     */
    public void load(final Reader reader, String name) throws JsUnitException, IOException {
        if (reader == null) {
            throw new IllegalArgumentException("The reader is null");
        }
        if (name == null) {
            name = "anonymous";
        }
        context = Context.enter(context);
        try {
            context.evaluateReader(scope, reader, name, 1, null);
        } catch (final JavaScriptException e) {
            throw new JsUnitException("Cannot evaluate JavaScript code of " + name, e);
        } finally {
            IOUtils.closeQuietly(reader);
            Context.exit();
        }
    }

    /**
     * Evaluate the given JavaScript in the current context.
     * 
     * @param code the JavaScript
     * @param name the name of the script (may be null)
     * @return the evaluated value
     * @throws JsUnitException if the code was not valid
     * @throws IllegalArgumentException if <code>code</code>is <code>null</code>
     * @since upcoming
     */
    public Object eval(final String code, String name) throws JsUnitException {
        if (code == null) {
            throw new IllegalArgumentException("The code is null");
        }
        if (name == null) {
            name = "anonymous";
        }
        context = Context.enter(context);
        try {
            final Object result = context.evaluateString(scope, code, name, 1, null);
            return result;// Context.toString(result);
        } catch (final JavaScriptException e) {
            throw new JsUnitException("Cannot evaluate JavaScript code of " + name, e);
        } finally {
            Context.exit();
        }
    }

    /**
     * Runs the TestSuite &quot;AllTests&quot;. The result of the test is written in XML format
     * into the given writer. Since the result is a complete XML document, the writer is closed
     * by the method (even in case of an exception).
     * 
     * @param writer the writer receiving the result
     * @throws JsUnitException if no JavaScript class <code>AllTests</code>can be found
     * @throws IOException if writing to the <code>writer</code> fails
     * @throws IllegalArgumentException if <code>writer</code>is <code>null</code>
     * @throws JsUnitRuntimeException if the JavaScript code of the method itself fails
     * @since upcoming
     */
    public void runAllTests(final Writer writer) throws JsUnitException, IOException {
        if (writer == null) {
            throw new IllegalArgumentException("The writer is null");
        }
        context = Context.enter(context);
        try {
            try {
                if (Boolean.TRUE != context.evaluateString(
                        scope,
                        "this.AllTests && AllTests.prototype && AllTests.prototype.suite && true",
                        null, 1, null)) {
                    throw new JsUnitException("No JavaScript class AllTests with a suite method found");
                }
            } catch (final EcmaError e) {
                throw new JsUnitRuntimeException("Cannot evaluate internal JavaScript code", e);
            } catch (final JavaScriptException e) {
                throw new JsUnitRuntimeException("Cannot evaluate internal JavaScript code", e);
            }
            try {
                final String xml = (String)context
                        .evaluateString(
                                scope,
                                ""
                                        + "var stringWriter = new StringWriter();\n"
                                        + "var runner = new TextTestRunner(new XMLResultPrinter(stringWriter));\n"
                                        + "runner.doRun(AllTests.prototype.suite());\n"
                                        + "stringWriter.get();\n", "AllTests", 1, null);
                writer.write(xml);
            } catch (final EcmaError e) {
                throw new JsUnitRuntimeException("JavaScript error running tests", e);
            } catch (final JavaScriptException e) {
                throw new JsUnitRuntimeException("Cannot evaluate internal JavaScript code", e);
            }
        } finally {
            Context.exit();
            IOUtils.closeQuietly(writer);
        }
    }

    /**
     * Runs all JavaScript TestSuites in the context. The method will collect any JavaScript
     * <code>TestSuite</code> in the context in a collecting <code>TestSuite</code> and run
     * it. The result of the test is written in XML format into the given writer. Since the
     * result is a complete XML document, the writer is closed by the method (even in case of an
     * exception).
     * 
     * @param writer the writer receiving the result
     * @param name the name of the collecting <code>TestSuite</code> (may be null)
     * @throws IOException if writing to the <code>writer</code> fails
     * @throws IllegalArgumentException if <code>writer</code>is <code>null</code>
     * @throws JsUnitRuntimeException if the JavaScript code of the method itself fails
     * @since upcoming
     */
    public void runTestSuites(final Writer writer, String name) throws IOException {
        if (writer == null) {
            throw new IllegalArgumentException("The writer is null");
        }
        name = name == null ? "AllTestSuites" : name;
        context = Context.enter(context);
        try {
            try {
                final String xml = (String)context
                        .evaluateString(
                                scope,
                                ""
                                        + "var suite = new TestSuite(\""
                                        + name
                                        + "\");\n"
                                        + "for (fn in this) {\n"
                                        + "    if (new String(fn).match(/TestSuite$/)) {\n"
                                        + "        fn = eval(fn);\n"
                                        + "        if (typeof(fn) == \"function\" && fn.prototype && fn.prototype.suite) {\n"
                                        + "            suite.addTest(fn.prototype.suite());\n"
                                        + "        }\n"
                                        + "    }\n"
                                        + "}\n"
                                        + "var stringWriter = new StringWriter();\n"
                                        + "var runner = new TextTestRunner(new XMLResultPrinter(stringWriter));\n"
                                        + "runner.doRun(suite);\n"
                                        + "stringWriter.get();\n", name, 1, null);
                writer.write(xml);
            } catch (final EcmaError e) {
                throw new JsUnitRuntimeException("JavaScript error running tests", e);
            } catch (final JavaScriptException e) {
                throw new JsUnitRuntimeException("Cannot evaluate internal JavaScript code", e);
            }
        } finally {
            Context.exit();
            IOUtils.closeQuietly(writer);
        }
    }

    /**
     * Runs all JavaScript TestCases in the context. The method will collect any JavaScript
     * <code>TestCase</code> in the context in a collecting <code>TestSuite</code> and run
     * it. The result of the test is written in XML format into the given writer. Since the
     * result is a complete XML document, the writer is closed by the method (even in case of an
     * exception).
     * 
     * @param writer the writer receiving the result
     * @param name the name of the collecting <code>TestSuite</code> (may be null)
     * @throws IOException if writing to the <code>writer</code> fails
     * @throws IllegalArgumentException if <code>writer</code>is <code>null</code>
     * @throws JsUnitRuntimeException if the JavaScript code of the method itself fails
     * @since upcoming
     */
    public void runTestCases(final Writer writer, String name) throws IOException {
        if (writer == null) {
            throw new IllegalArgumentException("The writer is null");
        }
        name = name == null ? "AllTestCases" : name;
        context = Context.enter(context);
        try {
            try {
                final String xml = (String)context
                        .evaluateString(
                                scope,
                                ""
                                        + "var suite = new TestSuite(\""
                                        + name
                                        + "\");\n"
                                        + "for (fname in this) {\n"
                                        + "    if (new String(fname).match(/Test$/)) {\n"
                                        + "        var fn = eval(fname);\n"
                                        + "        if (typeof(fn) == \"function\" && fn.prototype && fn.prototype instanceof TestCase) {\n"
                                        + "            suite.addTestSuite(fn);\n"
                                        + "        }\n"
                                        + "    }\n"
                                        + "}\n"
                                        + "var stringWriter = new StringWriter();\n"
                                        + "var runner = new TextTestRunner(new XMLResultPrinter(stringWriter));\n"
                                        + "runner.doRun(suite);\n"
                                        + "stringWriter.get();\n", "AllTestCases", 1, null);
                writer.write(xml);
            } catch (final EcmaError e) {
                throw new JsUnitRuntimeException("JavaScript error running tests", e);
            } catch (final JavaScriptException e) {
                throw new JsUnitRuntimeException("Cannot evaluate internal JavaScript code", e);
            }
        } finally {
            Context.exit();
            IOUtils.closeQuietly(writer);
        }
    }
}
