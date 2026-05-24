<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('brand');
            $table->string('category');
            $table->decimal('price', 10, 2);
            $table->decimal('oldPrice', 10, 2)->nullable();
            $table->decimal('rating', 3, 1)->default(4.5);
            $table->text('image')->nullable();
            $table->string('tag')->nullable();
            $table->string('caseSize')->nullable();
            $table->string('movement')->nullable();
            $table->unsignedInteger('stock')->default(0);
            $table->string('waterResistance')->nullable();
            $table->string('warranty')->nullable();
            $table->string('delivery')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
