/*
JsUnit - a JUnit port for JavaScript
Copyright (C) 2006 Joerg Schaible

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * Verifys the syntax of an email address.
 * @tparam String email the email address to verify.
 */
function EmailValidatorTest( name )
{
    TestCase.call( this, name );
}
function EmailValidatorTest_testStandardEmail()
{
    this.assertTrue( verifyEmail( "john.doe@acme.com" ));
}
function EmailValidatorTest_testEmailToLocalhost()
{
    this.assertTrue( verifyEmail( "root@localhost" ));
}
function EmailValidatorTest_testEmailUsesASCII7Charcters()
{
    this.assertFalse( verifyEmail( "jörg@localhost" ));
}
function EmailValidatorTest_testDomainHasARoot()
{
    this.assertFalse( verifyEmail( "john.doe@noroot" ));
}
function EmailValidatorTest_testDomainRootHasAtLeastTwoCharacters()
{
    this.assertFalse( verifyEmail( "john.doe@test.x" ));
}
function EmailValidatorTest_testNameMayNotEndWithDot()
{
    this.assertFalse( verifyEmail( "john.@test.x" ));
}
function EmailValidatorTest_testNameMayNotStartWithDot()
{
    this.assertFalse( verifyEmail( ".doe@test.x" ));
}
function EmailValidatorTest_testNameMustExist()
{
    this.assertFalse( verifyEmail( "@test.x" ));
}
function EmailValidatorTest_testDomainMustExist()
{
    this.assertFalse( verifyEmail( "joehn.doe@" ));
}
EmailValidatorTest.prototype = new TestCase();
EmailValidatorTest.glue();

