<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MapController extends Controller
{
    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string',
        ]);

        $query = $request->input('q');

        $response = Http::withHeaders([
            'User-Agent' => 'KonsulHerbalApp/1.0 (https://konsulherbal.com)',
        ])->get('https://nominatim.openstreetmap.org/search', [
            'q' => $query,
            'format' => 'json',
            'limit' => 5, // Dapatkan beberapa hasil untuk pilihan
        ]);

        if ($response->successful()) {
            return response()->json($response->json());
        }

        return response()->json(['error' => 'Gagal mengambil data dari layanan geocoding.'], 500);
    }

    public function reverse(Request $request)
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
        ]);

        $lat = $request->input('lat');
        $lon = $request->input('lon');

        $response = Http::withHeaders([
            'User-Agent' => 'KonsulHerbalApp/1.0 (https://konsulherbal.com)',
        ])->get('https://nominatim.openstreetmap.org/reverse', [
            'lat' => $lat,
            'lon' => $lon,
            'format' => 'json',
        ]);
        
        if ($response->successful()) {
            return response()->json($response->json());
        }

        return response()->json(['error' => 'Gagal mengambil data dari layanan geocoding.'], 500);
    }
}
