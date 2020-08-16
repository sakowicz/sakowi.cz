<?php

use App\Model\Photo;
use Illuminate\Database\Seeder;

class PhotoSeeder extends Seeder
{
    const DEFAULT_PHOTOS = [
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

    public function run()
    {
        foreach (static::DEFAULT_PHOTOS as $defaultPhoto) {
            $photo = new Photo();
            $photo->title = $defaultPhoto['title'];
            $photo->image = $defaultPhoto['url'];
            $photo->subtitle = $defaultPhoto['subtitle'];
            $photo->is_on_homepage = true;
            $photo->save();
        }
    }
}
