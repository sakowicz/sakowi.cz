<?php

use App\Model\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        $user = new User();
        $user->name = config('user.admin-name');
        $user->email = config('user.admin-email');
        $user->password = bcrypt(config('user.admin-password'));
        $user->save();
    }
}
