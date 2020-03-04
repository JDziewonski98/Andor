import { Farmer } from '.';

export var map = [
    {
        "id" : 0,
        "adjRegionsIds" : [
            11, 7, 5, 4, 1, 2, 6
        ],
        "hasWell":false,
        "nextRegionId":-1,
        "hasMerchant":false,
        "farmers": new Array()
    },
    {
        "id" : 1,
        "adjRegionsIds" : [
            0, 2, 3, 4
        ],
        "hasWell":false,
        "nextRegionId":0,
        "hasMerchant" : false
    },
    {
        "id" : 2,
        "adjRegionsIds" : [
            0, 1, 3, 14, 6
        ],
        "hasWell":false,
        "nextRegionId":0,
        "hasMerchant":false
    },
    {
        "id" : 3,
        "adjRegionsIds" : [
            1, 2, 14, 10, 19, 20, 4
        ],
        "hasWell":false,
        "nextRegionId":1,
        "hasMerchant":false
    },
    {
        "id" : 4,
        "adjRegionsIds" : [
            0, 1, 3, 20, 21, 5
        ],
        "hasWell":false,
        "nextRegionId":0,
        "hasMerchant":false
    },
    {
        "id" : 5,
        "adjRegionsIds" : [
            0, 4, 21
        ],
        "hasWell":true,
        "nextRegionId":0,
        "hasMerchant":false
    },
    {
        "id" : 6,
        "adjRegionsIds" : [
            0, 11, 13, 17, 14, 2
        ],
        "hasWell":false,
        "nextRegionId":0,
        "hasMerchant":false
    },
    {
        "id" : 7,
        "adjRegionsIds" : [
            15, 9, 8, 0, 11
        ],
        "hasWell":false,
        "nextRegionId":0,
        "hasMerchant":false
    },
    {
        "id" : 8,
        "adjRegionsIds" : [
            7, 9, 11
        ],
        "hasWell":false,
        "nextRegionId":7,
        "hasMerchant":false
    },
    {
        "id" : 9,
        "adjRegionsIds" : [
            15, 7, 8
        ],
        "hasWell":false,
        "nextRegionId":7,
        "hasMerchant":false
    },
    {
        "id" : 10,
        "adjRegionsIds" : [
            3, 14, 19, 18
        ],
        "hasWell":false,
        "nextRegionId":3,
        "hasMerchant":false
    },
    {
        "id" : 11,
        "adjRegionsIds" : [
            0, 7, 8, 12, 6, 13
        ],
        "hasWell":false,
        "nextRegionId":0,
        "hasMerchant":false
    },
    {
        "id" : 12,
        "adjRegionsIds" : [
            11, 13
        ],
        "hasWell":false,
        "nextRegionId":11,
        "hasMerchant":false
    },
    {
        "id" : 13,
        "adjRegionsIds" : [
            12, 11, 6, 17, 16
        ],
        "hasWell":false,
        "nextRegionId":6,
        "hasMerchant":false
    },
    {
        "id" : 14,
        "adjRegionsIds" : [
            2, 3, 6, 10, 17, 18
        ],
        "hasWell":false,
        "nextRegionId":2,
        "hasMerchant":false
    },
    {
        "id" : 15,
        "adjRegionsIds" : [
            9, 7
        ],
        "hasWell":false,
        "nextRegionId":7,
        "hasMerchant":false
    },
    {
        "id" : 16,
        "adjRegionsIds" : [
            13, 17, 36, 32, 38, 48
        ],
        "hasWell":false,
        "nextRegionId":13,
        "hasMerchant":false
    },
    {
        "id" : 17,
        "adjRegionsIds" : [
            16, 13, 6, 14, 18, 36
        ],
        "hasWell":false,
        "nextRegionId":6,
        "hasMerchant":false
    },
    {
        "id" : 18,
        "adjRegionsIds" : [
            10, 14, 17, 19, 72, 36, 28
        ],
        "hasWell":false,
        "nextRegionId":14,
        "hasMerchant":true
    },
    {
        "id" : 19,
        "adjRegionsIds" : [
            3, 10, 20, 22, 23, 72, 18
        ],
        "hasWell":false,
        "nextRegionId":3,
        "hasMerchant":false
    },
    {
        "id" : 20,
        "adjRegionsIds" : [
            3, 4, 21, 22, 19
        ],
        "hasWell":false,
        "nextRegionId":3,
        "hasMerchant":false
    },
    {
        "id" : 21,
        "adjRegionsIds" : [
            4, 5, 20, 22, 24
        ],
        "hasWell":false,
        "nextRegionId":4,
        "hasMerchant":false
    },
    {
        "id" : 22,
        "adjRegionsIds" : [
            19, 20, 21, 23, 24
        ],
        "hasWell":false,
        "nextRegionId":19,
        "hasMerchant":false
    },
    {
        "id" : 23,
        "adjRegionsIds" : [
            19, 22, 24, 25, 31, 34, 35, 72
        ],
        "hasWell":false,
        "nextRegionId":19,
        "hasMerchant":false
    },
    {
        "id" : 24,
        "adjRegionsIds" : [
            21, 22, 23, 25
        ],
        "hasWell":false,
        "nextRegionId":21,
        "hasMerchant":false,
        "farmers": new Array(),
    },
    {
        "id" : 25,
        "adjRegionsIds" : [
            23, 24, 31, 27, 26
        ],
        "hasWell":false,
        "nextRegionId":24,
        "hasMerchant":false
    },
    {
        "id" : 26,
        "adjRegionsIds" : [
            25, 27
        ],
        "hasWell":false,
        "nextRegionId":25,
        "hasMerchant":false
    },
    {
        "id" : 27,
        "adjRegionsIds" : [
            25, 26, 31
        ],
        "hasWell":false,
        "nextRegionId":25,
        "hasMerchant":false
    },
    {
        "id" : 28,
        "adjRegionsIds" : [
            36, 38, 18, 29, 72
        ],
        "hasWell":false,
        "nextRegionId":18,
        "hasMerchant":false
    },
    {
        "id" : 29,
        "adjRegionsIds" : [
            28, 72, 34, 30
        ],
        "hasWell":false,
        "nextRegionId":28,
        "hasMerchant":false
    },
    {
        "id" : 30,
        "adjRegionsIds" : [
            29, 34, 33, 35
        ],
        "hasWell":false,
        "nextRegionId":29,
        "hasMerchant":false
    },
    {
        "id" : 31,
        "adjRegionsIds" : [
            27, 25, 23, 35, 33
        ],
        "hasWell":false,
        "nextRegionId":23,
        "hasMerchant":false
    },
    {
        "id" : 32,
        "adjRegionsIds" : [
            16, 38
        ],
        "hasWell":false,
        "nextRegionId":16,
        "hasMerchant":false
    },
    {
        "id" : 33,
        "adjRegionsIds" : [
            30, 35, 31
        ],
        "hasWell":false,
        "nextRegionId":30,
        "hasMerchant":false
    },
    {
        "id" : 34,
        "adjRegionsIds" : [
            72, 23, 35, 30, 29
        ],
        "hasWell":false,
        "nextRegionId":23,
        "hasMerchant":false
    },
    {
        "id" : 35,
        "adjRegionsIds" : [
            34, 23, 31, 33, 30
        ],
        "hasWell":true,
        "nextRegionId":23,
        "hasMerchant":false
    },
    {
        "id" : 36,
        "adjRegionsIds" : [
            16, 17, 18, 28, 38
        ],
        "hasWell":false,
        "nextRegionId":16,
        "hasMerchant":false
    },
    {
        "id" : 37,
        "adjRegionsIds" : [
            41
        ],
        "hasWell":false,
        "nextRegionId":41,
        "hasMerchant":false
    },
    {
        "id" : 38,
        "adjRegionsIds" : [
            32, 16, 36, 28, 39
        ],
        "hasWell":false,
        "nextRegionId":16,
        "hasMerchant":false
    },
    {
        "id" : 39,
        "adjRegionsIds" : [
            42, 40, 38, 43
        ],
        "hasWell":false,
        "nextRegionId":38,
        "hasMerchant":false
    },
    {
        "id" : 40,
        "adjRegionsIds" : [
            41, 39
        ],
        "hasWell":false,
        "nextRegionId":39,
        "hasMerchant":false
    },
    {
        "id" : 42,
        "adjRegionsIds" : [
            43, 44, 39
        ],
        "hasWell":false,
        "nextRegionId":39,
        "hasMerchant":false
    },
    {
        "id" : 43,
        "adjRegionsIds" : [
            39, 42, 44, 45, 71
        ],
        "hasWell":false,
        "nextRegionId":39,
        "hasMerchant":false
    },
    {
        "id" : 44,
        "adjRegionsIds" : [
            42, 43, 45, 46
        ],
        "hasWell":false,
        "nextRegionId":42,
        "hasMerchant":false
    },
    {
        "id" : 45,
        "adjRegionsIds" : [
            46, 44, 43, 65, 64
        ],
        "hasWell": true,
        "nextRegionId": 43,
        "hasMerchant":false
    },
    {
        "id" : 46,
        "adjRegionsIds" : [
            64, 45, 44, 47
        ],
        "hasWell":false,
        "nextRegionId":44,
        "hasMerchant":false
    },
    {
        "id" : 47,
        "adjRegionsIds" : [
            48, 53, 54, 56, 46
        ],
        "hasWell":false,
        "nextRegionId":46,
        "hasMerchant":false
    },
    {
        "id" : 48,
        "adjRegionsIds" : [
            49, 50, 51, 53, 47, 16
        ],
        "hasWell":false,
        "nextRegionId":16,
        "hasMerchant":false
    },
    {
        "id" : 49,
        "adjRegionsIds" : [
            50, 48
        ],
        "hasWell":false,
        "nextRegionId":48,
        "hasMerchant":false
    },
    {
        "id" : 50,
        "adjRegionsIds" : [
            48, 49, 51, 52
        ],
        "hasWell":false,
        "nextRegionId":48,
        "hasMerchant":false
    },
    {
        "id" : 51,
        "adjRegionsIds" : [
            55, 52, 50, 48, 53
        ],
        "hasWell":false,
        "nextRegionId":48,
        "hasMerchant":false
    },
    {
        "id" : 52,
        "adjRegionsIds" : [
            55, 51, 50
        ],
        "hasWell":false,
        "nextRegionId":50,
        "hasMerchant":false
    },
    {
        "id" : 53,
        "adjRegionsIds" : [
            54, 51, 47, 48, 55
        ],
        "hasWell":false,
        "nextRegionId":47,
        "hasMerchant":false
    },
    {
        "id" : 54,
        "adjRegionsIds" : [
            55, 53, 47, 56, 57
        ],
        "hasWell":false,
        "nextRegionId":47,
        "hasMerchant":false
    },
    {
        "id" : 55,
        "adjRegionsIds" : [
            52, 51, 54, 57, 53
        ],
        "hasWell":true,
        "nextRegionId":51,
        "hasMerchant":false
    },
    {
        "id" : 56,
        "adjRegionsIds" : [
            47, 54, 57, 63
        ],
        "hasWell":false,
        "nextRegionId":47,
        "hasMerchant":false
    },
    {
        "id" : 57,
        "adjRegionsIds" : [
            55, 54, 56, 63, 58, 59
        ],
        "hasWell":false,
        "nextRegionId":54,
        "hasMerchant":true
    },
    {
        "id" : 58,
        "adjRegionsIds" : [
            62, 60, 59, 57, 63
        ],
        "hasWell":false,
        "nextRegionId":57,
        "hasMerchant":false
    },
    {
        "id" : 59,
        "adjRegionsIds" : [
            60, 58, 57
        ],
        "hasWell":false,
        "nextRegionId":57,
        "hasMerchant":false
    },
    {
        "id" : 60,
        "adjRegionsIds" : [
            58, 59, 62
        ],
        "hasWell":false,
        "nextRegionId":59,
        "hasMerchant":false
    },
    {
        "id" : 61,
        "adjRegionsIds" : [
            62, 58, 63, 64
        ],
        "hasWell":false,
        "nextRegionId":58,
        "hasMerchant":false
    },
    {
        "id" : 62,
        "adjRegionsIds" : [
            60, 58, 61
        ],
        "hasWell":false,
        "nextRegionId":58,
        "hasMerchant":false
    },
    {
        "id" : 63,
        "adjRegionsIds" : [
            61, 58, 57, 56, 64
        ],
        "hasWell":false,
        "nextRegionId":56,
        "hasMerchant":false
    },
    {
        "id" : 64,
        "adjRegionsIds" : [
            63, 61, 65, 45, 46
        ],
        "hasWell":false,
        "nextRegionId":45,
        "hasMerchant":false
    },
    {
        "id" : 65,
        "adjRegionsIds" : [
            64, 45, 66
        ],
        "hasWell":false,
        "nextRegionId":45,
        "hasMerchant":false
    },
    {
        "id" : 66,
        "adjRegionsIds" : [
            65, 67
        ],
        "hasWell":false,
        "nextRegionId":65,
        "hasMerchant":false
    },
    {
        "id" : 67,
        "adjRegionsIds" : [
            66, 68
        ],
        "hasWell":false,
        "nextRegionId": 66,
        "hasMerchant":false
    },
    {
        "id" : 68,
        "adjRegionsIds" : [
            69, 67
        ],
        "hasWell":false,
        "nextRegionId":67,
        "hasMerchant":false
    },
    {
        "id" : 69,
        "adjRegionsIds" : [
            70, 68
        ],
        "hasWell":false,
        "nextRegionId":68,
        "hasMerchant":false
    },
    {
        "id" : 70,
        "adjRegionsIds" : [
            81, 69
        ],
        "hasWell":false,
        "nextRegionId":69,
        "hasMerchant":false
    },
    {
        "id" : 71,
        "adjRegionsIds" : [
            43
        ],
        "hasWell":false,
        "nextRegionId":43,
        "hasMerchant":true
    },
    {
        "id" : 72,
        "adjRegionsIds" : [
            18, 19, 23, 34, 29, 28
        ],
        "hasWell":false,
        "nextRegionId":18,
        "hasMerchant":false
    },
    {
        "id" : 73,
        "adjRegionsIds" : [],
        "hasWell":false,
        "nextRegionId":-1,
        "hasMerchant":false
    },
    {
        "id" : 74,
        "adjRegionsIds" : [],
        "hasWell":false,
        "nextRegionId":-1,
        "hasMerchant":false
    },
    {
        "id" : 75,
        "adjRegionsIds" : [],
        "hasWell":false,
        "nextRegionId":-1,
        "hasMerchant":false
    },
    {
        "id" : 76,
        "adjRegionsIds" : [],
        "hasWell":false,
        "nextRegionId":-1,
        "hasMerchant":false
    },
    {
        "id" : 77,
        "adjRegionsIds" : [],
        "hasWell":false,
        "nextRegionId":-1,
        "hasMerchant":false
    },
    {
        "id" : 78,
        "adjRegionsIds" : [],
        "hasWell":false,
        "nextRegionId":-1,
        "hasMerchant":false
    },
    {
        "id" : 79,
        "adjRegionsIds" : [],
        "hasWell":false,
        "nextRegionId":-1,
        "hasMerchant":false
    },
    {
        "id" : 80,
        "adjRegionsIds" : [],
        "hasWell":false,
        "nextRegionId":-1,
        "hasMerchant":false
    },
    {
        "id" : 81,
        "adjRegionsIds" : [
            70, 82
        ],
        "hasWell":false,
        "nextRegionId":70,
        "hasMerchant":false
    },
    {
        "id" : 82,
        "adjRegionsIds" : [
            84, 81
        ],
        "hasWell":false,
        "nextRegionId":81,
        "hasMerchant":false
    },
    {
        "id" : 83,
        "adjRegionsIds" : [],
        "hasWell":false,
        "nextRegionId":-1,
        "hasMerchant":false
    },
    {
        "id" : 84,
        "adjRegionsIds" : [
            82
        ],
        "hasWell":false,
        "nextRegionId":82,
        "hasMerchant":false
    }
]
