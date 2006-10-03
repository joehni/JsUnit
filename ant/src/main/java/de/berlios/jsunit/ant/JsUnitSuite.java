/*
 * Copyright (C) 2006 Jörg Schaible
 * Created on 17.09.2006 by Jörg Schaible
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
package de.berlios.jsunit.ant;

import de.berlios.jsunit.JsUnitException;
import de.berlios.jsunit.JsUnitRhinoRunner;

import org.apache.commons.io.output.TeeOutputStream;
import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.DirectoryScanner;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.types.EnumeratedAttribute;
import org.apache.tools.ant.types.FileSet;
import org.apache.tools.ant.util.FileUtils;
import org.apache.tools.ant.util.StringUtils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.Iterator;
import java.util.Vector;


/**
 * A JsUnit subtask modelling a test suite.
 * 
 * @author J&ouml;rg Schaible
 * @since upcoming
 */
public class JsUnitSuite {

    private String name;
    private File toDir;
    private TestRunType type = new TestRunType("RUN_TESTSUITES");
    private final Vector fileSets = new Vector();
    private int errors;
    private int failures;

    /**
     * Set the name of the test suite.
     * 
     * @param name the name
     * @since upcoming
     */
    public void setName(final String name) {
        this.name = name;
    }

    /**
     * Retrieves the name of the test suite.
     * 
     * @return the name
     * @since upcoming
     */
    public String getName() {
        return name;
    }

    /**
     * Set the type of the test suite.
     * 
     * @param type the type
     * @see JsUnitTask
     * @since upcoming
     */
    public void setType(final TestRunType type) {
        this.type = type;
    }

    /**
     * Set the directory for the generated XML reports.
     * 
     * @param toDir the target directory
     * @since upcoming
     */
    public void setToDir(final File toDir) {
        this.toDir = toDir;
    }

    /**
     * Add a FileSet with JsUnit tests.
     * 
     * @param fileSet the file set.
     * @since upcoming
     */
    public void addFileSet(final FileSet fileSet) {
        fileSets.addElement(fileSet);
    }

    /**
     * The enumeration fr the test type.
     * 
     * @since upcoming
     */
    public static final class TestRunType extends EnumeratedAttribute {
        /**
         * Default constructor.
         * 
         * @since upcoming
         */
        public TestRunType() {
            super();
        }

        TestRunType(final String value) {
            super();
            setValue(value);
        }

        public String[] getValues() {
            return new String[]{"RUN_ALLTESTS", "RUN_TESTSUITES", "RUN_TESTCASES"};
        }
    }

    /**
     * Run the test suite.
     * @param project the project
     * @param runner the prepared Rhino context
     * @throws BuildException if the test cannot run or have been aborted
     * @since upcoming
     */
    public void run(final Project project, final JsUnitRhinoRunner runner)
            throws BuildException {
        if (!toDir.isDirectory()) {
            toDir.mkdirs();
        }
        for (final Iterator iter = fileSets.iterator(); iter.hasNext();) {
            final FileSet fileSet = (FileSet)iter.next();
            final DirectoryScanner scanner = fileSet.getDirectoryScanner(project);
            final String[] files = scanner.getIncludedFiles();
            for (int i = 0; i < files.length; i++) {
                final File file = new File(scanner.getBasedir(), files[i]);
                try {
                    runner.load(new FileReader(file), files[i]);
                    project.log("Loaded " + file.getPath(), Project.MSG_DEBUG);
                } catch (final FileNotFoundException e) {
                    throw new BuildException("Cannot find " + file.getPath(), e);
                } catch (final JsUnitException e) {
                    throw new BuildException("Cannot evaluate JavaScript code of "
                            + file.getPath(), e);
                } catch (final IOException e) {
                    throw new BuildException("Cannot read complete " + file.getPath(), e);
                }
            }
        }
        final File file = new File(toDir, "TEST-" + name + ".xml");
        final ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Writer writer;
        try {
            writer = new OutputStreamWriter(new TeeOutputStream(new FileOutputStream(file), baos));
        } catch (final IOException e) {
            throw new BuildException("Cannot create file " + file.getName(), e);
        }
        try {
            switch (type.getIndex()) {
            case 0:
                runner.runAllTests(writer);
                break;
            case 1:
                runner.runTestSuites(writer, name);
                break;
            case 2:
                runner.runTestCases(writer, name);
                break;
            }
            project.log("Created test report " + file.getName(), Project.MSG_DEBUG);
        } catch (final JsUnitException e) {
            throw new BuildException("Cannot run JavaScript code of test suite " + name, e);
        } catch (final IOException e) {
            throw new BuildException("Cannot write to file " + file.getName(), e);
        } finally {
            FileUtils.close(writer);
        }
        final String[] lines = (String[]) StringUtils.lineSplit(baos.toString()).toArray(new String[0]);
        int idx = lines[1].indexOf("errors=\"") + 8;
        errors = Integer.parseInt(lines[1].substring(idx, lines[1].indexOf('"', idx)));
        idx = lines[1].indexOf("failures=\"") + 10;
        failures = Integer.parseInt(lines[1].substring(idx, lines[1].indexOf('"', idx)));
    }

    /**
     * Retrieve the number of errors.
     * 
     * @return the error count
     * @since upcoming
     */
    public int getErrors() {
        return this.errors;
    }

    /**
     * Retrieve the number of failures.
     * 
     * @return the failure count
     * @since upcoming
     */
    public int getFailures() {
        return this.failures;
    }

}
