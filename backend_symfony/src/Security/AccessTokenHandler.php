<?php

namespace App\Security;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Http\AccessToken\AccessTokenHandlerInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;

class AccessTokenHandler implements AccessTokenHandlerInterface
{
    private string $jwtSecret;

    public function __construct(ParameterBagInterface $params)
    {
        // Récupère ton 'jwt_secret' défini dans services.yaml
        $this->jwtSecret = $params->get('jwt_secret');
    }

    public function getUserBadgeFrom(string $accessToken): UserBadge
    {
        try {
            // Décode le token avec ta clé et l'algo HS256
            $decoded = JWT::decode($accessToken, new Key($this->jwtSecret, 'HS256'));
            $payload = (array) $decoded;

            // On récupère l'identifiant (ex: email ou id) stocké dans le payload
            $userIdentifier = $payload['email'] ?? null;

            if (!$userIdentifier) {
                throw new BadCredentialsException('Token invalide : identifiant manquant.');
            }

            // Renvoie le badge à Symfony pour authentifier l'utilisateur
            return new UserBadge($userIdentifier);

        } catch (\Exception $e) {
            // Si le token est expiré ou mal signé, Symfony lancera le 401 via l'EntryPoint
            throw new BadCredentialsException('Accès refusé : ' . $e->getMessage());
        }
    }
}
