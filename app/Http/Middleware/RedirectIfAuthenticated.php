<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::user();
                if ($user->peran === 'admin') {
                    return redirect()->intended('/admin/dashboard')->with([
                        'success' => false,
                        'message' => 'Anda sudah login sebagai admin, silahkan klik tombol logout untuk keluar!',
                    ]);
                } else {
                    return redirect()->intended('/dashboard')->with([
                        'success' => false,
                        'message' => 'Anda sudah login sebagai pengguna, silahkan klik tombol logout untuk keluar!',
                    ]);
                }
            }
        }

        return $next($request);
    }
}
