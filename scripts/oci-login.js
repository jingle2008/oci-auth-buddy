/**
 * Automates steps 1 and 2 on https://login.oci.oraclecloud.com/*
 * 1. Click "Sign in with a different user account"
 * 2. Click "Continue"
 */

clickWhenAvailable('.session-change', false, 50, 200, 'Step1: diff-account');
clickWhenAvailable('#submit-tenant', false, 50, 200, 'Step2: continue tenancy');
