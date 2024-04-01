import React from 'react';
import GeneralLayout from '../../components/general/GeneralLayout';
function TermsAndConditionsPage() {
    return (
        <GeneralLayout>
            <div className="terms-conditions">
                <h1 className="text-2xl font-bold mb-4">Terms and Conditions for University Magazine Article Submissions</h1>
                <p className='text-justify'>Welcome to our university magazine's article submission platform. By submitting your article ("Content") to us, you agree to comply with and be bound by the following terms and conditions. Please review them carefully. If you do not agree with any part of these terms and conditions, you should not submit your article to us.</p>

                <h2 className="text-xl font-bold">1. Introduction</h2>
                <p className='text-justify'>By submitting your article for consideration by our university magazine, you affirm that you are the sole author of the Content and that you own all rights to it or have received appropriate permission to use any parts not authored by you. You retain copyright to your Content, but you grant us a non-exclusive, worldwide, perpetual, royalty-free license to publish, distribute, and display the Content in our magazine, on our website, and in related promotional materials.</p>

                <h2 className="text-xl font-bold">2. Intellectual Property Rights</h2>
                <p className='text-justify'>Upon submitting your article to us, you agree not to submit content that is copyrighted by someone else without their permission, violates any law, or could be considered libelous, defamatory, obscene, or offensive.</p>

                <h2 className="text-xl font-bold">3. User Conduct</h2>
                <p className='text-justify'>Articles must adhere to our submission guidelines, which include relevance to the magazine's audience and themes, adherence to academic integrity and standards, and proper citation of sources and quotations. The editorial team reserves the right to reject any article that does not meet these guidelines.</p>

                <h2 className="text-xl font-bold">4. Submission Guidelines</h2>
                <p className='text-justify'>We are committed to protecting your privacy. Personal information collected through the submission process will only be used for the purpose of evaluating your article and communicating with you about it.</p>

                <h2 className="text-xl font-bold">5. Privacy</h2>
                <p className='text-justify'>We reserve the right to modify these terms and conditions at any time. By continuing to submit articles after such modifications, you agree to be bound by the updated terms and conditions.</p>

                <h2 className="text-xl font-bold">6. Changes to Terms and Conditions</h2>
                <p className='text-justify'>These terms and conditions are governed by the laws of [Jurisdiction/Country]. Any disputes related to these terms will be subject to the exclusive jurisdiction of the courts of that jurisdiction.</p>

                <h2 className="text-xl font-bold">Acknowledgment</h2>
                <p className='text-justify'>By submitting your article, you acknowledge that you have read, understood, and agree to these Terms and Conditions.</p>
            </div>
        </GeneralLayout>
    );
}

export default TermsAndConditionsPage;
