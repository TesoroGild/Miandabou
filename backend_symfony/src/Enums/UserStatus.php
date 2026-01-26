<?php

namespace App\Enums;

enum UserStatus: string
{
    case Admin = 'admin';
    case Employee = 'employee';
    case Client = 'client';
}