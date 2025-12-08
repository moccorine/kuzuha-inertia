<?php

return [
    'messages_per_page' => env('BBS_MESSAGES_PER_PAGE', 10),
    'active_visitor_timeout' => env('BBS_ACTIVE_VISITOR_TIMEOUT', 300),
    'min_post_interval' => env('BBS_MIN_POST_INTERVAL', 3),
    'ip_post_interval' => env('BBS_IP_POST_INTERVAL', 20),
    'duplicate_check_count' => env('BBS_DUPLICATE_CHECK_COUNT', 30),
];
