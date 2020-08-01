<?php
namespace App\Http\Controllers\App;

use App\Http\Controllers\AppController;
use Illuminate\Http\JsonResponse;

class PhotographyController extends AppController
{
    public function index(): JsonResponse
    {
        $photosMock = [
            [
                "url" => 'images/most-redzinski-ksiezyc.jpg',
                "title" => 'Księżyc nad pylonem Mostu Rędzińskiego',
                "subtitle" => 'Sierp zachodzącego satelity nad najwyższym mostem w Polsce'
            ],
            [
                "url" => 'images/pelnia-skytower.jpg',
                "title" => 'Księżyc nad Skytower',
                "subtitle" => 'O mały włos i by się zderzyły!'
            ],
            [
                "url" => 'images/photos/katedra-ksiezyc.jpg',
                "title" => 'Oko Wrocławia',
                "subtitle" => 'Wchodzący Księżyc nad Ostrowem Tumskim'
            ],
            [
                "url" => 'images/panorama-wroclaw.jpg',
                "title" => 'Panorama Wrocławia',
                "subtitle" => 'Widać m. in. Skytower oraz wyłaniającą się zza chmur Ślężę'
            ],
            [
                "url" => 'images/tecza-nad-katedra.jpg',
                "title" => 'Tęcza nad Katedrą',
                "subtitle" => 'Archikatedra św. Jana Chrzciciela'
            ],
            [
                "url" => 'images/photos/droga-mleczna-hermanovice.jpg',
                "title" => 'Z głową w gwiazdach',
                "subtitle" => 'Droga Mleczna nad Heřmanovicami'
            ],
            [
                "url" => 'images/hala-stulecia-ksiezyc.jpg',
                "title" => 'Księżyc nad Halą Stulecia',
                "subtitle" => 'Nasz naturalny satelita zawisnął na żurawiu'
            ],
            [
                "url" => 'images/skytower-ksiezyc-sierp.jpg',
                "title" => 'Zachodzący Księżyc',
                "subtitle" => 'Sierp zachodzącego Księżyca obok Skytower'
            ],
            [
                "url" => 'images/photos/droga-mleczna-balaton.jpg',
                "title" => 'Galaktyczny Pomost',
                "subtitle" => 'Balaton, Węgry'
            ],
            [
                "url" => 'images/photos/wschod-ksiezyca-nysa.jpg',
                "title" => 'Wschód Księżyca nad katedrą',
                "subtitle" => 'Bazylika św. Jakuba i św. Agnieszki w Nysie'
            ],
            [
                "url" => 'images/photos/skytower-tecza.jpg',
                "title" => 'Tęcza nad SkyTower',
                "subtitle" => 'Wrocław',
            ]
        ];

        shuffle($photosMock);

        return response()->json($photosMock);
    }

}
