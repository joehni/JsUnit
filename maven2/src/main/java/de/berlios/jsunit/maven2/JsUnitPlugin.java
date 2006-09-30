/*
 * Copyright (C) 2006 Jörg Schaible
 * Created on 30.09.2006 by Jörg Schaible
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
package de.berlios.jsunit.maven2;

import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;

import java.io.File;

/**
 * @todo Auto-generated JavaDoc
 * 
 * @author J&ouml;rg Schaible
 * @since upcoming
 */
public class JsUnitPlugin extends AbstractMojo {
    /**
     * Set this to 'true' to bypass unit tests entirely. Its use is NOT RECOMMENDED, but quite convenient on occasion.
     *
     * @parameter expression="${maven.test.skip}"
     */
    private boolean skip;

    /**
     * Set this to 'true' to bypass unit tests execution, but still compile them. Its use is NOT RECOMMENDED, but quite convenient on occasion.
     *
     * @parameter expression="${maven.test.skip.exec}"
     */
    private boolean skipExec;

    /**
     * Set this to true to ignore a failure during testing. Its use is NOT RECOMMENDED, but quite convenient on occasion.
     *
     * @parameter expression="${maven.test.failure.ignore}"
     */
    private boolean testFailureIgnore;

    /**
     * The base directory of the project being tested. This can be obtained in your unit test by System.getProperty("basedir").
     *
     * @parameter expression="${basedir}"
     * @required
     */
    private File basedir;

    /**
     * Base directory where all reports are written to.
     *
     * @parameter expression="${project.build.directory}/surefire-reports"
     */
    private File reportsDirectory;

    /**
     * The test source directory containing test class sources.
     *
     * @parameter expression="${basedir}/src/test/js"
     * @required
     */
    private File testSourceDirectory;

    /**
     * Option to print summary of test suites or just print the test cases that have errors.
     *
     * @parameter expression="${surefire.printSummary}"
     * default-value="true"
     */
    private boolean printSummary;




    public void execute() throws MojoExecutionException, MojoFailureException {
        // @todo Auto-generated method stub

    }

}
