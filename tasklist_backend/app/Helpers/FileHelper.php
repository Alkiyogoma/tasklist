<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;

class FileHelper
{
    public static function uploadImage($file, $path = 'uploads/images')
    {
        try {
            if ($file && $file->isValid()) {
                $fileName = uniqid() . '.' . $file->getClientOriginalExtension();
    
                // Store the file in the specified path under 'public' disk
                $filePath = $file->storeAs($path, $fileName, 'public');
    
                return url(Storage::url($filePath));
            }
    
            throw new \RuntimeException('Invalid file upload.');
        } catch (\Exception $e) {
            throw new \RuntimeException('Image upload failed: ' . $e->getMessage());
        }
    }
    
}
