<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class QuoteTest extends TestCase
{
    public function test_quote_simple_text(): void
    {
        $body = 'あ';
        $expected = "> あ\n\n";

        $this->assertEquals($expected, quote_post($body));
    }

    public function test_quote_text_with_url(): void
    {
        $body = "あ\n\nhttps://www.youtube.com/watch?v=AYcfFfSLAGE";
        $expected = "> あ\n> \n> https://www.youtube.com/watch?v=AYcfFfSLAGE\n\n";

        $this->assertEquals($expected, quote_post($body));
    }

    public function test_quote_removes_double_quotes(): void
    {
        $body = "> > already quoted\nregular text";
        $expected = "> regular text\n\n";

        $this->assertEquals($expected, quote_post($body));
    }

    public function test_quote_multiline_text(): void
    {
        $body = "line1\nline2\nline3";
        $expected = "> line1\n> line2\n> line3\n\n";

        $this->assertEquals($expected, quote_post($body));
    }

    public function test_quote_empty_lines(): void
    {
        $body = "text\n\nmore text";
        $expected = "> text\n> \n> more text\n\n";

        $this->assertEquals($expected, quote_post($body));
    }
}
