<?php

namespace App\Service;  

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class UploadService
{
    private string $uploadDir;
    private ParameterBagInterface $parameterBag;

    public function __construct(string $uploadDir, ParameterBagInterface $parameterBag)
    {
        $this->uploadDir = $uploadDir;
        $this->parameterBag = $parameterBag;
    }

    public function handleImageUpload(UploadedFile $file): array
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $hash = hash_file('sha256', $file->getRealPath());
        
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }

        $file->move($this->uploadDir, $hash);
        
        return [
            'filename' => $originalName,
            'hash' => $hash
        ];
    }

    // public function handleImageUpload(UploadedFile $file): array
    // {
    //     $originalName = $file->getClientOriginalName();
    //     $tmpPath = $file->getPathname();

    //     $hash = sha1_file($tmpPath);
    //     $destination = $this->uploadDir . '/' . $hash;

    //     // Créer le dossier s’il n’existe pas
    //     if (!file_exists($this->uploadDir)) {
    //         mkdir($this->uploadDir, 0755, true);
    //     }

    //     // Déplacer le fichier
    //     $file->move($this->uploadDir, $hash);

    //     return [
    //         'filename' => $originalName,
    //         'hash' => $hash,
    //         'path' => $destination,
    //     ];
    // }
}