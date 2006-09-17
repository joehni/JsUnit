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
            throw new IllegalArgumentException("Reader may not be null");
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
     * @since upcoming
     */
    public Object eval(final String code, String name) throws JsUnitException {
        if (code == null) {
            throw new IllegalArgumentException("Code may not be null");
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

    public void runAllTests(final Writer writer)
            throws JsUnitException, IOException {
        context = Context.enter(context);
        try {
            try {
                if (Boolean.TRUE != context.evaluateString(
                        scope,
                        "AllTests && AllTests.prototype && AllTests.prototype.suite && true",
                        null, 1, null)) {
                    throw new JsUnitException("No class AllTests with a suite method found");
                }
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
            } catch (final JavaScriptException e) {
                throw new JsUnitRuntimeException("Cannot evaluate internal JavaScript code", e);
            }
        } finally {
            Context.exit();
            IOUtils.closeQuietly(writer);
        }
    }

    public void runTestSuites(final Writer writer, String name)
            throws JsUnitException, IOException {
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
            } catch (final JavaScriptException e) {
                throw new JsUnitRuntimeException("Cannot evaluate internal JavaScript code", e);
            }
        } finally {
            Context.exit();
            IOUtils.closeQuietly(writer);
        }
    }

    public void runTestCases(final Writer writer, String name)
            throws JsUnitException, IOException {
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
            } catch (final JavaScriptException e) {
                throw new JsUnitRuntimeException("Cannot evaluate internal JavaScript code", e);
            }
        } finally {
            Context.exit();
            IOUtils.closeQuietly(writer);
        }
    }
}
