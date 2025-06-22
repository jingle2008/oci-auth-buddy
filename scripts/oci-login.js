/**
 * Automates steps 1 and 2 on https://login.oci.oraclecloud.com/*
 * 1. Click "Sign in with a different user account"
 * 2. Click "Continue"
 */

clickWhenAvailable('.session-change', 50, 200, 'Step1: select a different user account');
clickWhenAvailable('#submit-tenant', 50, 200, 'Step2: continue with boat tenancy');
