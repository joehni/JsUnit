/*
 * Copyright (C) 2006 Jörg Schaible
 * Created on 15.09.2006 by Jörg Schaible
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

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.types.FileSet;

import org.jmock.cglib.MockObjectTestCase;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;


/**
 * @author J&ouml;rg Schaible
 */
public class JsUnitTaskTest extends MockObjectTestCase {

    private Project project;
    private File outDir;

    protected void setUp() throws Exception {
        super.setUp();
        outDir = new File("target/junit");
        if (outDir.exists()) {
            FileUtils.cleanDirectory(outDir);
        }
        project = new Project();
        project.setBaseDir(new File("."));
    }

    public void testThrowsBuildExceptionWithoutTestSuites() {
        JsUnitTask task = new JsUnitTask();
        task.setProject(project);
        try {
            task.execute();
            fail("Thrown " + BuildException.class.getName() + " expected");
        } catch (final BuildException e) {
            assertThat(e.getMessage().toLowerCase(), contains("no test suites"));
        }
    }

    public void testLoadsSourceForTest() throws FileNotFoundException, IOException {
        File outDir = new File("target/junit");
        JsUnitTask task = new JsUnitTask();
        task.setProject(project);
        task.setDir(new File("src/test/js"));
        JsUnitTask.SourceFile file = task.createSource();
        file.setFile("Source.js");

        JsUnitSuite suite = task.createTestSuite();
        FileSet fileSet = new FileSet();
        fileSet.setDir(new File("src/test/js"));
        fileSet.setIncludes("SourceTest.js");
        suite.addFileSet(fileSet);
        suite.setType(new JsUnitSuite.TestRunType("RUN_TESTCASES"));
        suite.setName("Source");
        suite.setToDir(outDir);

        task.execute();

        assertTrue(new File(outDir, "TEST-Source.xml").isFile());

        String source = IOUtils.toString(new FileReader(new File(outDir, "TEST-Source.xml")));
        assertThat(source, and(
                and(contains("errors=\"0\""), contains("failures=\"0\"")),
                contains("tests=\"1\"")));
    }

    public void testRunsIsolatedTests() throws FileNotFoundException, IOException {
        JsUnitTask task = new JsUnitTask();
        task.setProject(project);

        JsUnitSuite suite = task.createTestSuite();
        FileSet fileSet = new FileSet();
        fileSet.setDir(new File("src/test/js"));
        fileSet.setIncludes("FirstTest.js");
        suite.addFileSet(fileSet);
        suite.setType(new JsUnitSuite.TestRunType("RUN_TESTCASES"));
        suite.setName("First");
        suite.setToDir(outDir);

        suite = task.createTestSuite();
        fileSet = new FileSet();
        fileSet.setDir(new File("src/test/js"));
        fileSet.setIncludes("IsolatedTest.js");
        suite.addFileSet(fileSet);
        suite.setType(new JsUnitSuite.TestRunType("RUN_TESTCASES"));
        suite.setName("Isolated");
        suite.setToDir(outDir);

        task.execute();

        assertTrue(new File(outDir, "TEST-First.xml").isFile());
        assertTrue(new File(outDir, "TEST-Isolated.xml").isFile());

        String first = IOUtils.toString(new FileReader(new File(outDir, "TEST-First.xml")));
        String isolated = IOUtils
                .toString(new FileReader(new File(outDir, "TEST-Isolated.xml")));
        assertThat(first, and(
                and(contains("errors=\"0\""), contains("failures=\"0\"")),
                contains("tests=\"1\"")));
        assertThat(isolated, and(
                and(contains("errors=\"0\""), contains("failures=\"0\"")),
                contains("tests=\"1\"")));
    }

    public void testSourceDirectoryMustExist() {
        JsUnitTask task = new JsUnitTask();
        task.setProject(project);
        task.setDir(new File("target/does-not-exist"));
        try {
            task.execute();
            fail("Thrown " + BuildException.class.getName() + " expected");
        } catch (final BuildException e) {
            assertThat(e.getMessage().toLowerCase(), contains("not found"));
        }
    }
}
