<?php
namespace App\Model;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    protected $fillable = ['image', 'title', 'subtitle', 'is_on_homepage'];

    public function scopeOnHomepage(Builder $query)
    {
        return $query->where('is_on_homepage', true);
    }
}
