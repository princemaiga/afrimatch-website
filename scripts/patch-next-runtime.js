#!/usr/bin/env node
/**
 * Patches Next.js 14 runtime files to fix the React dispatcher sync issue.
 *
 * Root cause: The prod runtime (app-page.runtime.prod.js) has its own internal
 * ReactCurrentDispatcher `k={current:null}` which is only set during actual SSR
 * rendering (not during static generation). During static generation, k.current
 * remains null, causing "Cannot read properties of null (reading 'useContext')".
 *
 * Fix: Inject a __rcd() helper right after k={current:null} is defined (in the same
 * var statement, so it's in the same scope), then replace all k.current.xxx hook
 * calls with (__rcd()).xxx.
 * The helper returns the installed React's ReactCurrentDispatcher.current when k.current is null.
 */

const fs = require('fs');
const path = require('path');

const NEXT_DIR = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'compiled', 'next-server');
const PROD_RUNTIME = path.join(NEXT_DIR, 'app-page.runtime.prod.js');
const DEV_RUNTIME = path.join(NEXT_DIR, 'app-page.runtime.dev.js');

const PROD_PATCH_MARKER = '/*__AFRIMATCH_PROD_PATCH__*/';
const DEV_PATCH_MARKER = '/*__AFRIMATCH_DISPATCHER_SYNC__*/';

// The k definition in the prod runtime (module-scoped within the webpack bundle)
const K_DEF = 'k={current:null},_={current:null},x={transition:null}';

// The __rcd helper function - injected right after k={current:null} in the same var statement
// This makes __rcd in the same scope as k, so it can access k.current
const RCD_HELPER = '__rcd=function(){' +
  'if(k&&k.current)return k.current;' +
  'try{' +
    'var r=require("react").__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;' +
    'if(r&&r.ReactCurrentDispatcher&&r.ReactCurrentDispatcher.current)' +
      'return r.ReactCurrentDispatcher.current;' +
  '}catch(e){}' +
  'return{' +
    'useContext:function(){return null},' +
    'useState:function(i){return[i,function(){}]},' +
    'useEffect:function(){},' +
    'useCallback:function(f){return f},' +
    'useMemo:function(f){return f()},' +
    'useRef:function(i){return{current:i}},' +
    'useReducer:function(r,i){return[i,function(){}]},' +
    'useId:function(){return""},' +
    'useLayoutEffect:function(){},' +
    'useInsertionEffect:function(){},' +
    'useDeferredValue:function(v){return v},' +
    'useTransition:function(){return[false,function(){}]},' +
    'useSyncExternalStore:function(s,g){return g()},' +
    'useImperativeHandle:function(){},' +
    'useDebugValue:function(){},' +
    'useOptimistic:function(v){return[v,function(){}]},' +
    'use:function(){return null},' +
    'useCacheRefresh:function(){return function(){}}' +
  '};' +
'}';

function patchProdRuntime() {
  if (!fs.existsSync(PROD_RUNTIME)) {
    console.log('Prod runtime not found, skipping.');
    return;
  }

  let content = fs.readFileSync(PROD_RUNTIME, 'utf8');

  // Check if already patched
  if (content.includes(PROD_PATCH_MARKER)) {
    console.log('Prod runtime already patched.');
    return;
  }

  // Verify the k definition exists
  if (!content.includes(K_DEF)) {
    console.error('ERROR: k definition pattern not found in prod runtime!');
    process.exit(1);
  }

  // Count k.current. occurrences
  const matches = content.match(/\bk\.current\./g);
  console.log('Found ' + (matches ? matches.length : 0) + ' k.current. occurrences in prod runtime');

  // Step 1: Inject __rcd helper right after k={current:null} in the same var statement
  const PATCHED_K_DEF = 'k={current:null},' + RCD_HELPER + ',_={current:null},x={transition:null}';
  content = content.replace(K_DEF, PATCHED_K_DEF + PROD_PATCH_MARKER);

  // Step 2: Replace k.current. (method calls) with (__rcd()).
  content = content.replace(/\bk\.current\.(\w)/g, '(__rcd()).$1');

  fs.writeFileSync(PROD_RUNTIME, content);
  console.log('Prod runtime patched successfully (' + (matches ? matches.length : 0) + ' hook calls patched).');
}

function patchDevRuntime() {
  if (!fs.existsSync(DEV_RUNTIME)) {
    console.log('Dev runtime not found, skipping.');
    return;
  }

  let content = fs.readFileSync(DEV_RUNTIME, 'utf8');

  // Check if already patched
  if (content.includes(DEV_PATCH_MARKER)) {
    console.log('Dev runtime already patched.');
    return;
  }

  const ORIGINAL = 'of={},op=t,od=e,oh=r,oj=!1';

  if (!content.includes(ORIGINAL)) {
    console.log('Dev runtime pattern not found, skipping dev runtime patch.');
    return;
  }

  const PATCHED = 'of={},op=t,od=e,oh=r,oj=!1;' +
    '(function(){' +
      'try{' +
        'var __ir=require("react");' +
        'if(__ir&&__ir.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED&&t){' +
          '__ir.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current=' +
          't.ReactCurrentDispatcher?t.ReactCurrentDispatcher.current:t;' +
        '}' +
      '}catch(e){}' +
    '})()' + DEV_PATCH_MARKER;

  content = content.replace(ORIGINAL, PATCHED);
  fs.writeFileSync(DEV_RUNTIME, content);
  console.log('Dev runtime patched successfully.');
}

try {
  patchProdRuntime();
  patchDevRuntime();
  console.log('All patches applied successfully.');
} catch (err) {
  console.error('Patch error:', err.message);
  process.exit(1);
}
