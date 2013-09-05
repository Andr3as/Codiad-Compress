<?php
/*
 * Copyright (c) Codiad & Andr3as, distributed
 * as-is and without warranty under the MIT License. 
 * See [root]/license.md for more information. This information must remain intact.
 */

    require_once('../../common.php');
    require_once('CSSTidy/class.csstidy.php');
    
    checkSession();
    error_reporting(0);
    
    switch($_GET['action']) {
        
        case 'compressCSS':
            if (isset($_GET['path']) && isset($_POST['advanced'])) {
                $path = getWorkspacePath($_GET['path']);
                $css_code = file_get_contents($path);
                $css = new csstidy();
                $css->parse($css_code);
                if ($_POST['compression'] != "standard_compression") {
                    $css->load_template($_POST['compression']);
                }
                if ($_POST['advanced']) {
                    $css->set_cfg('compress_colors', $_POST['color']);
                    $css->set_cfg('compress_font-weight', $_POST['fontw']);
                    $css->set_cfg('remove_last_;', $_POST['bslash']);
                    $css->set_cfg('remove_bslash', $_POST['last']);
                }
                $code = $css->print->plain();
                $nFile = substr($path, 0, strrpos($path, ".css"));
                $nFile = $nFile . ".min.css";
                file_put_contents($nFile, $code);
                echo '{"status":"success","message":"CSS tidied!"}';
            } else {
                echo '{"status":"error","message":"Missing Parameter!"}';
            }
            break;
            
        case 'compressJS':
            if (isset($_GET['path']) && isset($_POST['code'])) {
                $path   = getWorkspacePath($_GET['path']);
                $nFile  = substr($path, 0, strrpos($path, ".js"));
                $nFile  = $nFile . ".min.js";
                file_put_contents($nFile, $_POST['code']);
                echo '{"status":"success","message":"JS minified!"}';
            } else {
                echo '{"status":"error","message":"Missing Parameter!"}';
            }
            break;
            
        case 'getContent':
            if (isset($_GET['path'])) {
                echo file_get_contents(getWorkspacePath($_GET['path']));
            } else {
                echo '{"status":"error","message":"Missing Parameter!"}';
            }
            break;
        
        default:
            echo '{"status":"error","message":"No Type"}';
            break;
    }
    
    function getWorkspacePath($path) {
        if (strpos($path, "/") == 0) {
            //Unix absolute path
            return $path;
        }
        if (strpos($path, ":/") !== false) {
            //Windows absolute path
            return $path;
        }
        if (strpos($path, ":\\") !== false) {
            //Windows absolute path
            return $path;
        }
        return "../../workspace/".$path;
    }
?>