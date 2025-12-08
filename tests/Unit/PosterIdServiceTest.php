<?php

namespace Tests\Unit;

use App\Services\PosterIdService;
use Tests\TestCase;

class PosterIdServiceTest extends TestCase
{
    private PosterIdService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new PosterIdService;
    }

    public function test_generates_8_character_id(): void
    {
        $posterId = $this->service->generate('127.0.0.1');

        $this->assertIsString($posterId);
        $this->assertEquals(8, strlen($posterId));
    }

    public function test_same_ip_same_day_generates_same_id(): void
    {
        $ip = '192.168.1.100';

        $id1 = $this->service->generate($ip);
        $id2 = $this->service->generate($ip);

        $this->assertEquals($id1, $id2);
    }

    public function test_different_ips_generate_different_ids(): void
    {
        $ip1 = '192.168.1.100';
        $ip2 = '192.168.1.101';

        $id1 = $this->service->generate($ip1);
        $id2 = $this->service->generate($ip2);

        $this->assertNotEquals($id1, $id2);
    }

    public function test_id_contains_only_hex_characters(): void
    {
        $posterId = $this->service->generate('127.0.0.1');

        $this->assertMatchesRegularExpression('/^[a-f0-9]{8}$/', $posterId);
    }
}
