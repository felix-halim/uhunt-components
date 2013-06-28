angular.module('uHunt.cpbook', ['uHunt.base'])

.value('cpbook_1ed', [
  {title:'Introduction', arr:
  [{title:'Ad Hoc', arr:[
    ['Ad Hoc',100,272,394,483,-573,661,739,837,941,10082,10141,10281,10363,-10420,10528,10683,10703,-10812,10921,11044,11150,11223,11340,11498,11547,11616,11727,11800
  ]]},{title:'Preview Contest', arr:[
    ['Preview',-10360,10341,11292,-11450,10911,-11635,11506,10243,10717,11512,10065
  ]]}]},

  {title:'Data Structures and Libraries', arr:
  [{title:'Data Structures With Built-in Libraries', arr:[
    ['Static array, vector, bitset, Direct Addressing Table', -482,-594,-11340
    ],['STL algorithm', -146,-10194,-10258
    ],['Sorting-related problems', -299,612,10810,-11462,-11495
    ],['STL stack', 127,-514,-673,-727
    ],['STL queue', -336,-10901,-11034
    ],['STL map/set', -10226,11239,-11308,-11136
    ],['STL priority_queue <a target="_blank" href="http://www.comp.nus.edu.sg/~stevenha/visualization/heap.html"><img height="15" border"0" src="images/img.png"></a>', -908,-11492
  ]]},{title:'Data Structures With Our-Own Libraries', arr:[
    ['Graph (simple ones)', -291,-10928
    ],['Union-Find Disjoint Sets', -459,-793,10158,10301,10369,10583,10608,-11503
    ],['Segment Tree', -11235,-11297,-11402
  ]]}]},

  {title:'Problem Solving Paradigms', arr:
  [{title:'Dynamic Programming', arr:[
    ['Longest Increasing Subsequence (LIS) - Classical', 103,111,231,-481,497,10051,10534,11003,-11456,-11790
    ],['Coin Change - Classical', 147,166,-357,674,-10306,10313,11137,-11517
    ],['Maximum Sum', -108,-507,836,10074,10667,10684,-10827
    ],['0-1 Knapsack - Classical', -562,-990,-10130
    ],['Non Classical (medium difficulty)', 116,-473,607,-10003,-10337,10891,11450
    ],['DP + Bitmasks', -10364,-10651,10908,-10911
    ],['DP on \'Graph Problem\'', -590,-910,10681,-10702
    ],['DP on Tree', -10243,-11307
  ]]},{title:'Complete Search', arr:[
    ['Iterative', 154,441,639,-725,-10360,10662,-11242,11804
    ],['Recursive Backtracking', -193,222,524,-624,628,729,-750,10285,10309,10496
  ]]},{title:'Divide and Conquer',arr:[
    ['Divide and Conquer', -679,-714,957,10077,-10341,10369,10474,10611,11262
  ]]},{title:'Greedy', arr:[
    ['Greedy', -410,10020,-10340,10440,-10670,10763,11054,11292,11369
  ]]}]},

  {title:'Graph', arr:
  [{title:'Depth First Search', arr:[
    ['Finding Connected Components / Flood Fill', 260,352,459,-469,572,-657,782,784,785,852,10336,10926,10946,-11110,11518,11749
    ],['Finding Articulation Points / Bridges', -315,610,-796,-10199
    ],['Finding Strongly Connected Components', -10731,-11504,-11709,11770
    ],['Topological Sort', -124,200,-872,-10305
  ]]},{title:'Breadth First Search', arr:[
    ['SSSP on Unweighted Graph', -336,383,417,429,439,-532,567,627,762,924,928,10009,10044,10067,10102,10150,10422,10610,-10653,10959,11049,11352,11513,11545,11730,11792
    ],['Variants', -10004,10505,11080,-11101,-11624
  ]]},{title:'Kruskal\'s', arr:[
    ['Standard Application (for MST)', -908,10034,10307,11228,-11631,11710,11733,-11747
    ],['Variants', 10147,-10369,-10397,-10600,10842
  ]]},{title:'Dijkstra\'s', arr:[
    ['Dijkstra\'s', -341,929,10278,10603,-10801,10986,11377,-11492,11635
  ]]},{title:'Bellman Ford\'s', arr:[
    ['Bellman Ford\'s', -558,-10557,-11280
  ]]},{title:'Floyd Warshall\'s', arr:[
    ['Standard Application (for APSP or SSSP on small graph)', 186,341,423,-821,10075,-10171,10246,10724,10793,10803,11015,-11463
    ],['Variants', -334,534,544,-869,925,-10048,10099
  ]]},{title:'Ford Fulkerson\'s / Edmonds Karps\'s', arr:[
    ['Standard Application (for Max Flow/Min Cut)', -820,-10480,10779,-11506
    ],['Variants', -563,-10330,10511,-10594,10806
  ]]},{title:'Special Graph', arr:[
    ['Tree', 112,115,122,536,615,699,712,-10308,10459,10701,-10938,-11695
    ],['Single-Source Shortest/Longest Paths in DAG', -103,-10000,10029,10166,-10350,11324
    ],['Counting Paths in DAG', -825,-926,-988
    ],['Max Cardinality Bipartite Matching', -670,753,10080,-10092,10735,-11045,11418
    ],['Max Weighted Independent Set in Bipartite Graph', -11159
    ],['Max Vertex Cover in Bipartite Graph', -11419
  ]]}]},

  {title:'Mathematics',arr:
  [{title:'Number Theory', arr:[
    ['Ad Hoc', 344,377,-10346,10940,-11130,-11231,11313,11428,11547,11723,11805
    ],['Prime Numbers', 294,406,516,524,-543,583,686,897,914,10006,10042,10140,10200,10235,10311,10394,10533,-10539,10637,10650,10699,-10738,10780,10789,10852,10924,10948,11287,11408,11466
    ],['GCD/LCM', 332,412,530,10193,-10407,10680,-10717,-10892,11388,11417
    ],['Euler\'s Totient (Phi) Function', -10179,-10299,-10820,11064,11327
    ],['Extended Euclid', -718,-10090,-10104
    ],['Modulo Arithmetic', -374,602,10174,-10176,-10212,10489
    ],['Fibonacci Numbers', 495,-763,900,948,10183,10229,-10334,10450,10497,10579,-10862,11000,11161,11780
    ],['Factorial', 160,-324,568,-623,884,10061,10139,10220,10323,10780,10856,-11347,11415
    ],['Big Integer (use Java)', 343,355,389,424,446,636,10083,10106,10473,-10523,10551,-10814,-10925
    ],['Combinatorics', 326,369,-991,-10007,10219,10303,10375,10784,10790,10918,11069,11115,11204,11310,-11401,11554
    ],['Cycle-Finding', -350,408,944,-10591,11036,-11053,11549
  ]]},{title:'Sequences and Number Systems', arr:[
    ['Sequences', -100,413,694,-10408,-10930,11063
    ],['Number Systems', 136,138,-443,640,962,974,10006,-10042,10044,10101,10591,11461,-11472
  ]]},{title:'Others', arr:[
      ['Probability Theory', 474,542,10056,-10491,-11176,-11181,11500
    ],['Linear Algebra', -10089,-10109
  ]]}]},

  {title:'String Processing', arr:
  [{title:'Ad Hoc String Processing', arr:[
    ['Ad Hoc', 148,159,263,353,401,409,-422,537,644,865,-902,10010,10115,10197,10293,10391,10508,10815,10878,10896,11048,11056,11062,11221,11233,11278,11362,-11385,11713,11716,11734
  ]]},{title:'String Processing with DP', arr:[
    ['String Processing with DP', -164,531,10066,10100,-10192,10405,10739,-11151
  ]]},{title:'Suffix Array', arr:[
    ['Suffix Array', -719,10526,-11107,-11512
  ]]}]},

  {title:'(Computational) Geometry', arr:
  [{title:'Geometry Basics', arr:[
    ['Lines', 184,-270,833,10180,10242,-10263,11068,-11227
    ],['Circles (only)', -10005,-10012,10136,10221,10432,-10451,10589
    ],['Triangles (plus Circles)', 143,-190,438,10195,-10286,10347,10991,-11152,11437,11479,11524,11579
    ],['Rectangles', 201,-476,922,10502,10908,-11207,-11455
    ],['Great Circle Distance', -535,-10075,10316,10897,-11817
    ],['Polygons', 478,-634,-10078,10112,-11447,11473
    ],['Other Basic Geometry', -10088,-10297,10387,11232,-11507
  ]]},{title:'Graham\'s Scan for Convex Hull', arr:[
    ['Graham\'s Scan', -109,218,361,681,-811,10002,-10065,10135,10173,11626
  ]]},{title:'Intersection Problems', arr:[
    ['Line Segment Intersection', -191,-378,866,920,972,-10902,11343
    ],['Other Objects', 453,-460,-737,904,-10301,10321,11122,11345,11515,11601,11639
  ]]},{title:'Divide and Conquer Revisited', arr:[
    ['Divide and Conquer Revisited', -10245,-10566,11378,-11646,11648
  ]]}]}
])

.value('cpbook_2ed', [
  {title:"Introduction", arr:
  [{title:"Ad Hoc Problems - Part 1", arr:[
    ["Easy", 272, 494, 499, 10300, -10420, 10550, 11044, 11172, 11332, 11498, 11547, -11559, 11727, 11764, -11799, 11942, 12015
    ],["Game (Card)", 162, -462, 555, -10205, -10646, 11225, 11678
    ],["Game (Chess)", 255, -278, -696, 10196, -10284, 10849, 11494
    ],["Game (Others)", 220, 227, 232, 339, 340, 489, -584, 647, -10189, 10279, 10363, 10409, 10443, 10530, 10813, 10903, -11459
    ],["Josephus", 130, 133, -151, -305, 402, 440, -10015
    ],["Palindrome / Anagram", 148, -156, -195, 353, 401, 454, 630, 10018, 10098, 10945, -11221, 11309
  ]]},{title:"Ad Hoc Problems - Part 2", arr:[
    ["Interesting Real Life Problems", -161, 346, 400, 403, 448, 538, -637, 706, 10082, 10191, 10415, 10528, 10554, 10659, -10812, 11223, 11530, 11743, 11984
    ],["Time", 170, 300, -579, -893, 10070, 10371, 10683, 11219, 11356, 11650, 11677, -11947, 11958, 12019
    ],["Just Ad Hoc", 101, 114, 119, 121, 139, 141, 144, 145, 187, 335, 337, 349, 362, 379, 381, 405, 434, 457, 496, -556, 573, 608, 621, 661, -978, 1091, 1225, 1241, 10019, 10033, -10114, 10141, 10142, 10188, 10267, 10324, 10424, 10707, 10865, 10919, 10963, 11140, 11507, 11586, 11661, 11679, 11687, 11717, 11850, 11917, 11946, 11956, 12060, 12085, 12136, 12250
  ]]}]},

  {title:"Data Structures and Libraries", arr:
  [{title:"Linear Data Structures with Built-in Libraries", arr:[
    ["Basic Data Structures", 394, 414, 466, 467, 482, 541, 591, 594, 700, 10016, 10038, 10050, 10260, 10703, 10855, 10920, 10978, 11040, 11192, 11222, -11340, 11349, 11360, 11364, 11496, -11581, 11608, 11760, 11835, 11933, -11988
    ],["C++ STL algorithm (Java Collections)", 123, -146, 1209, 10194, -10258, 10880, 10905, 11039, 11321, -11588, 11621, 11777, 11824
    ],["Sorting-related problems", 110, 299, 450, 612, -855, 10107, 10327, 10810, -11462, 11495, 11714, -11858
    ],["C++ STL stack (Java Stack)", 120, 127, -514, 551, 673, -727, 732, 10858, -11111
    ],["C++ STL queue (Java Queue)", 540, -10172, -10901, 10935, -11034
  ]]},{title:"Non Linear Data Structures with Built-in Libraries", arr:[
    ["C++ STL priority_queue (Java PriorityQueue) <a target='_blank' href='http://www.comp.nus.edu.sg/~stevenha/visualization/heap.html'><img height='15' border'0' src='images/img.png'></a>", -1203, -10954, -11995
    ],["C++ STL map/set (Java TreeMap/TreeSet)", 417, 484, 501, 642, 755, 860, -10226, 10282, 10295, 10374, 10686, 10815, 11062, 11136, 11239, -11286, 11308, -11629, 11849, 11860
  ]]},{title:"Data Structures with Our-Own Libraries", arr:[
    ["Graph Data Structures Problems <a target='_blank' href='http://www.comp.nus.edu.sg/~stevenha/visualization/representation.html'><img height='15' border'0' src='images/img.png'></a>", 599, -10720, -10895, 10928, 11414, 11550, -11991
    ],["Union-Find Disjoint Sets", 459, -793, 10158, 10178, 10227, -10507, 10583, 10608, 10685, -11503, 11690, 11966
    ],["Tree-related Data Structures <a target='_blank' href='http://www.comp.nus.edu.sg/~stevenha/visualization/bit.html'><img height='15' border'0' src='images/img.png'></a>", 297, 1232, -11235, 11297, 11350, -11402, 11525, -11926, 12086
  ]]}]},

  {title:"Problem Solving Paradigms", arr:
  [{title:"Complete Search", arr:[
    ["Iterative (The Easier Ones)", 102, 105, 140, 154, 188, 256, 296, 331, 347, 386, -435, 441, 471, 617, 626, 725, 927, 1237, 1260, 10041, 10102, 10365, 10487, 10662, 10677, 10976, 11001, 11005, 11059, 11078, -11242, 11342, 11412, 11565, -11742
    ],["Iterative (The More Challenging Ones)", 253, 639, 703, 735, 932, 10125, 10177, 10360, -10660, 10973, 11108, -11205, -11553, 11804, 11959
    ],["Recursive Backtracking (The Easier Ones)", 167, 222, 380, 487, 524, 539, 574, 598, -624, 628, 677, 729, 750, 1261, 10017, 10276, 10344, 10452, 10475, -10503, 10576, -11085, 11201, 12249
    ],["Recursive Backtracking (The More Challenging Ones)", 165, 193, 208, -416, 433, 565, 868, 1098, 1262, 10094, -10309, 10582, -11195
  ]]},{title:"Dynamic Programming", arr:[
    ["Longest Increasing Subsequence (LIS)", 111, 231, 437, -481, 497, 1196, 10131, 10534, -11456, -11790
    ],["Max Sum", -108, -507, 787, 836, 983, 10074, 10667, 10684, -10827
    ],["0-1 Knapsack (Subset Sum)", 562, 990, 1213, 10130, 10261, -10616, 10664, -10819, 11658, -11832
    ],["Coin Change (CC)", 147, 166, -357, 674, -10306, 10313, 11137, -11517
    ],["Traveling Salesman Problem (TSP)", -216, -10496, -11284
    ],["Other Classical Problems", -348, -10304
    ],["Non Classical (The Easier Ones)", 116, 571, 10003, 10036, -10337, 10400, 10465, -10721, 10910, 10912, -10943, 11341, 11407, 11420, 11450, 11703
  ]]},{title:"Greedy", arr:[
    ["Standard", 311, 410, 1193, 10020, 10026, 10152, 10249, 10340, 10382, 10440, 10602, -10656, 10670, 10672, 10700, 10714, 10718, 10747, 10763, 10785, 11054, 11103, -11157, 11292, 11369, -11389, 11520, 11532, 11567, 11729, 11900
  ]]},{title:"Divide and Conquer", arr:[
    ["Binary Search", 679, 957, 1195, 10077, -10341, 10474, 10611, 10706, 10742, 11057, -11413, 11876, 11881, -11935
  ]]}]},

  {title:"Graph", arr:
  [{title:"Graph Traversal <a target='_blank' href='http://www.comp.nus.edu.sg/~stevenha/visualization/dfsbfs.html'><img height='15' border'0' src='images/img.png'></a>", arr:[
    ["Just Graph Traversal", 118, -168, 280, 614, 824, 1205, 10113, 10116, 10377, 10687, -11831, -11902, 11906
    ],["Flood Fill/Finding Connected Components", 260, 352, 469, 572, 657, 776, 782, 784, 785, 852, 871, 1197, 10336, 10946, -11094, -11110, 11244, 11470, 11518, 11561, 11749, -11953
    ],["Topological Sort", 124, 200, -872, -10305, -11060, 11686
    ],["Bipartite Graph Check", -10004, 10505, -11080, -11396
    ],["Finding Articulation Points/Bridges", -315, 610, -796, -10199
    ],["Finding Strongly Connected Components", -247, 1229, 10731, -11504, 11709, 11770, -11838
  ]]},{title:"Minimum Spanning Tree <a target='_blank' href='http://www.comp.nus.edu.sg/~stevenha/visualization/mst.html'><img height='15' border'0' src='images/img.png'></a>", arr:[
    ["Standard", 908, 1208, 1235, 10034, -11228, -11631, 11710, 11733, -11747, 11857
    ],["Variants", 534, 544, 1216, 1234, 1265, -10048, 10099, 10147, -10369, 10397, 10462, -10600, 10842
  ]]},{title:"Single-Source Shortest Paths (SSSP) <a target='_blank' href='http://www.comp.nus.edu.sg/~stevenha/visualization/sssp.html'><img height='15' border'0' src='images/img.png'></a>", arr:[
    ["On Unweighted Graph: BFS", 314, -321, 336, 383, 429, 439, 532, 567, 627, 762, 924, 928, 1251, 1253, 10009, 10044, -10047, 10067, 10150, 10422, 10610, 10653, 10959, 10977, 11049, -11101, 11352, 11513, 11624, 11792, 11974, 12160
    ],["On Weighted Graph: Dijkstra's", 341, 929, 1202, 10166, 10269, 10278, 10389, 10603, -10801, 10986, -11367, 11377, -11492, 11833, 12138
    ],["On Graph with Negative Weight Cycle: Bellman Ford's", -558, -10557, -11280
  ]]},{title:"All-Pairs Shortest Paths", arr:[
    ["Standard", 186, 423, -821, 1198, 1233, 1247, -10171, 10724, 10793, 10803, 10947, 11015, -11463
    ],["Variants", -104, 125, 436, -334, 869, -11047
  ]]},{title:"Maximum Flow <a target='_blank' href='http://www.comp.nus.edu.sg/~stevenha/visualization/maxflow.html'><img height='15' border'0' src='images/img.png'></a>", arr:[
    ["Standard", -259, 753, -820, -10480, 10511, 10779
    ],["Variants", 563, 1242, 1259, 10092, 10330, -10594, -10746, 10806, -11506
  ]]},{title:"Special Graph (Directed Acyclic Graph)", arr:[
    ["Single-Source Shortest/Longest Paths on DAG", 103, -452, 10000, 10051, 10259, -10285, -10350
    ],["Counting Paths in DAG", 825, 926, 986, -988, -10401, 10926, 11067, -11957
    ],["Converting General Graph to DAG", 590, 907, 910, 1218, 10201, -10243, 10543, 10702, 10874, -10913, 11307, -11487, 11545, 11782, 12135
  ]]},{title:"Special Graphs (Others)", arr:[
    ["Tree", 112, 115, 122, 536, 615, 699, 712, 839, 10308, 10701, -10938, -11615, -11695
    ],["Eulerian Graph", 117, 291, -10054, 10129, -10203, -10596
    ],["Bipartite Graph", 670, 1184, 1194, 1201, 1212, 10080, -10349, 11045, -11138, -11159, 11418, 11419, 12083, 12168
  ]]}]},

  {title:"Mathematics", arr:
  [{title:"Ad Hoc Mathematics Problems", arr:[
    ["The Simpler Ones", 10055, 10071, 10281, 10469, -10773, 11614, -11723, 11805, -11875
    ],["Mathematical Simulation (Brute Force)", 100, 371, 382, -616, 834, 846, 906, 10035, -10346, 10370, 10783, 10879, -11130, 11150, 11247, 11313, 11689, 11877, 11934, 11968, 11970
    ],["Finding Pattern or Formula", 913, 10014, -10161, 10170, -10427, 10499, 10509, 10666, 10693, 10696, 10940, 10970, 10994, 11202, -11231, 11296
    ],["Grid", -264, 808, 880, -10182, -10233, 10620, 10642
    ],["Number Systems or Sequences", 136, 138, 413, -443, 640, 694, 962, 974, 1256, 10006, -10042, 10101, -10408, 10930, 11063, 11461, 11660
    ],["Logarithm, Exponentiation, Power", 107, 113, -701, -10916, 11636, 11666, -11847, 11986
    ],["Polynomial", 392, -498, -10268, 10302, -10586, 10719
    ],["Base Number Variants", -377, -575, 10093, -10931, 11121
    ],["Just Ad Hoc", 276, 344, 759, -10137, 10190, -11526, -11616, 11715, 11816
  ]]},{title:"Java BigInteger Class", arr:[
    ["Basic Features", 424, 465, 619, -713, 748, 1226, 10013, 10083, 10106, 10198, 10494, 10519, -10523, 10669, 10925, 11448, 11830, -11879, 12143
    ],["Bonus Features", 290, 343, 355, -389, 446, 636, 1230, 10464, 10473, 10551, -10814, 11185, -11821
  ]]},{title:"Combinatorics", arr:[
    ["Fibonacci Numbers", 495, 580, -763, 900, 948, 1258, 10183, -10334, 10450, 10497, 10579, -10689, 10862, 11000, 11161, 11780
    ],["Binomial Coefficients", 326, 369, -485, 530, 10105, -10219, 10375, -11955
    ],["Catalan Numbers", -991, -10007, 10223, -10303
    ],["Other Combinatorics", 1224, 1264, 10079, 10359, 10733, 10784, 10790, 10843, 10918, -11069, 11115, 11204, -11310, -11401, 11480, 11554, 11597, 11609
  ]]},{title:"Number Theory", arr:[
    ["Prime Numbers", 406, -543, 686, 897, 914, 1210, 10140, 10168, 10200, 10235, 10311, 10394, 10490, -10539, 10650, -10738, 10852, 10924, 10948, 11287, 11752
    ],["GCD and/or LCM", 106, 332, 408, 412, 10193, -10407, -10892, 11388, 11417, -11827
    ],["Factorial", -324, 568, -623, 10220, 10323, -10338
    ],["Finding Prime Factors", -516, -583, 10392, -11466
    ],["Working with Prime Factors", 160, 993, 10061, -10139, 10484, 10527, 10622, -10680, 10780, 10791, 11347, -11889, 12090
    ],["Functions involving Prime Factors", -294, 884, 1246, -10179, 10299, 10699, 10820, 11064, 11086, 11226, 11327, -11728
    ],["Modulo Arithmetic", 128, -374, 10127, 10174, -10176, -10212, 10489
    ],["Extended Euclid", -10090, -10104, 10633, 10673
    ],["Other Number Theory Problems", 547, 756, -10110, 10922, 10929, 11042, -11344, -11371
  ]]},{title:"Probability Theory", arr:[
    ["Standard", 474, 545, 10056, 10238, 10328, -10491, -10759, 11181, 11500, 11628, -12024
  ]]},{title:"Cycle-Finding", arr:[
    ["Standard", 202, 275, -350, 944, 10162, 10515, 10591, 11036, -11053, 11549, -11634
  ]]},{title:"Game Theory", arr:[
    ["Standard", 847, -10111, 10165, 10368, 10404, 10578, -11311, -11489
  ]]},{title:"Powers of a (Square) Matrix", arr:[
    ["Standard", -10229, -10681, -10870
  ]]}]},

  {title:"String Processing", arr:
  [{title:"Ad Hoc String Processing Problems", arr:[
    ["Cipher/Encode/Encrypt/Decode/Decrypt", 213, 245, 306, 444, 458, 468, 483, 492, 641, 739, 740, 741, 795, 850, 856, 865, 10222, -10851, -10878, 10896, 10921, 11220, 11278, -11385, 11541, 11697, 11716, 11787
    ],["Frequency Counting", 895, -902, 10008, 10062, -10252, 10293, 10625, 10789, -11203, 11577
    ],["Input Parsing", 271, 325, 327, 384, 391, 397, 442, 464, 486, 537, 576, 620, -622, 743, 933, -10058, 10854, 11148, -11878
    ],["Output Formatting", 320, 445, -488, 490, 10500, -10800, -10894, 11074, 11965
    ],["String Comparison", 409, -644, 671, -11048, -11056, 11233, 11713, 11734
    ],["Just Ad Hoc", 153, 263, 789, 892, -941, 1200, 1215, 1219, 1239, 10115, 10197, 10361, 10391, -10393, 10508, 10679, 10761, -11452, 11483, 11839, 11962, 12134
  ]]},{title:"String Matching", arr:[
    ["Standard", 455, -10298, 11362, -11475, -11576, 11888
    ],["In 2D Grid", -422, -10010, -11283
  ]]},{title:"String Processing with Dynamic Programming", arr:[
    ["Standard", 164, -526, 531, 963, 1192, 1207, 10066, 10100, 10192, 10405, 10617, -10635, 10739, -11151, 11258
  ]]},{title:"Suffix Trie, Tree, Array", arr:[
    ["Standard", 719, -760, 1223, 1227, 1254, -11107, -11512
  ]]}]},

  {title:"(Computational) Geometry", arr:
  [{title:"Basic Geometry", arr:[
    ["Points and Lines", 184, 191, 270, 356, 378, 587, 833, 837, -920, 1249, 10167, 10242, -10263, 10310, 10357, 10466, 10585, 10902, 10927, 11068, -11227, 11343, 11505
    ],["Circles (only)", -10005, -10012, 10136, 10180, 10209, 10221, 10301, 10432, -10451, 10573, 10589, 10678, 11515
    ],["Triangles (plus Circles)", 143, 190, 375, 438, 10195, 10210, 10286, 10347, 10387, 10522, -10577, 10991, -11152, 11479, 11854, -11909, 11936, 12165
    ],["Quadrilaterals", 155, 201, -460, 476, 477, 10502, 10823, 10908, -11207, 11345, 11455, 11639, -11834
    ],["Great-Circle Distance", -535, -10075, 10316, 10897, -11817
    ],["Other 3D Objects", -737, -815, -10297
  ]]},{title:"Polygon <a target='_blank' href='http://www.comp.nus.edu.sg/~stevenha/visualization/convexhull.html'><img height='15' border'0' src='images/img.png'></a>", arr:[
    ["Standard", 109, 218, 361, 478, 634, 681, -811, 858, 1206, 10060, 10065, 10078, 10088, 10112, 10406, -10652, 11096, -11265, 11447, 11473, 11626
  ]]},{title:"Divide and Conquer", arr:[
    ["Standard", -152, -10245, 10566, 10668, 11378, -11646
  ]]}]},

  {title:"More Advanced Topics", arr:
  [{title:"Problem Decomposition", arr:[
    ["Two Components - Binary Search the Answer and Other", 714, 1199, 1221, 10804, -10816, -10983, -11262, 11516, 12255
    ],["Two Components - Involving DP 1D Range Sum", 967, 10533, -10871, -10891, -11408
    ],["Two Components - SSSP and DP", 10917, -10937, 10944, -11405, -11813
    ],["Two Components - Involving Graph", 1243, 1250, 1263, 10307, 11267, -11324, -11635, -11721, 12070, 12074, 12159
    ],["Two Components - Involving Mathematics", -10637, -10717, -11428, 11730, 12137
    ],["Three/More Components", -1079, -10856, -11610
  ]]},{title:"More Advanced Dynamic Programming", arr:[
    ["DP + bitmask <a target='_blank' href='http://www.comp.nus.edu.sg/~stevenha/visualization/bitmask.html'><img height='15' border'0' src='images/img.png'></a>", 1099, 1204, 1252, -10296, 10364, 10651, -10817, 10911, 11218, -11391, 11472, 12063,
    ],["The More Challenging Ones", -473, 607, 882, 1096, 1211, 1214, 1220, 1222, 1228, 1231, 1236, 1238, 1240, 1244, 1245, 1248, 1255, 10069, 10081, 10163, 10164, 10271, -10482, -10626, 10898, 11285
  ]]},{title:"More Advanced Search", arr:[
    ["A*/IDA*", 652, 1217, 10073, -10181, -11163, -11212
  ]]}]}
])

.value('cpbook_3ed', [
  {title:"Introduction", arr:
  [{title:"Getting Started: The Easy Problems", arr:[
    ["Super Easy", 272, 1124, 10550, 11044, -11172, 11364, -11498, 11547, -11727, 12250, 12279, 12289, 12372, 12403, 12577
    ],["Easy", 621, -10114, 10300, 10963, 11332, -11559, 11679, 11764, -11799, 11942, 12015, 12157, 12468, 12503, 12554
    ],["Medium", 119, -573, 661, -10141, 10324, 10424, 10919, -11507, 11586, 11661, 11683, 11687, 11956, 12478
  ]]},{title:"Ad Hoc Problems - Part 1", arr:[
    ["Game (Card)", 162, -462, 555, 10205, 10315, -10646, 11225, 11678, -12247
    ],["Game (Chess)", 255, -278, -696, 10196, -10284, 10849, 11494
    ],["Game (Others), Easier", 340, -489, 947, -10189, 10279, 10409, 10530, -11459, 12239
    ],["Game (Others), Harder", 114, 141, 220, 227, 232, 339, 379, -584, 647, 10363, -10443, -10813, 10903
    ],["Palindrome", 353, -401, 10018, -10945, -11221, 11309
    ],["Anagram", 148, -156, -195, -454, 630, 642, 10098
    ],["Interesting Real Life Problems, Easier", -161, 187, 362, -637, 857, 10082, 10191, 10528, 10554, -10812, 11530, 11945, 11984, 12195, 12555
    ],["Interesting Real Life Problems, Harder", 139, 145, 333, 346, -403, 447, 448, 449, 457, 538, -608, 706, -1061, 10415, 10659, 11223, 11743, 12342
  ]]},{title:"Ad Hoc Problems - Part 2", arr:[
    ["Time", 170, 300, -579, -893, 10070, 10339, 10371, 10683, 11219, 11356, 11650, 11677, -11947, 11958, 12019, 12136, 12148, 12439, 12531
    ],["'Time Waster' Problems", 144, 214, 335, 337, 349, 381, 405, -556, 603, 830, 945, 10033, 10134, 10142, 10188, 10267, 10961, 11140, 11717, -12060, -12085, 12608
  ]]}]},

  {title:"Data Structures and Libraries", arr:
  [{title:"Linear Data Structures with Built-in Libraries", arr:[
    ["1D Array Manipulation", 230, 394, 414, 467, 482, 591, 665, 755, -10038, 10050, 10260, 10978, 11093, 11192, 11222, -11340, 11496, 11608, 11850, 12150, -12356
    ],["2D Array Manipulation", 101, 434, 466, 541, 10016, 10703, -10855, -10920, 11040, 11349, 11360, -11581, 11835, 12187, 12291, 12398
    ],["C++ STL algorithm (Java Collections)", 123, -146, 400, 450, 790, 855, 1209, 10057, -10107, 10194, -10258, 10698, 10880, 10905, 11039, 11321, 11588, 11777, 11824, 12541
    ],["Bit Manipulation", 594, 700, 1241, -10264, 11173, 11760, -11926, -11933
    ],["C++ STL list (Java LinkedList)", -11988
    ],["C++ STL stack (Java Stack)", 127, -514, -732, -1062, 10858
    ],["C++ STL queue and deque (Java Queue and Deque)", 540, -10172, -10901, 10935, -11034, 12100, 12207
  ]]},{title:"Non Linear Data Structures with Built-in Libraries", arr:[
    ["C++ STL map (Java TreeMap)", 417, 484, 860, 939, 10132, 10138, -10226, 10282, 10295, 10686, 11239, -11286, 11308, 11348, -11572, 11629, 11860, 11917, 12504, 12592
    ],["C++ STL set (Java TreeSet)", 501, -978, 10815, 11062, -11136, -11849, 12049
    ],["C++ STL priority_queue (Java PriorityQueue)", -1203, -10954, -11995
  ]]},{title:"Data Structures with Our-Own Libraries", arr:[
    ["Graph Data Structures Problems", -599, -10895, 10928, 11550, -11991
    ],["Union-Find Disjoint Sets", -793, 1197, 10158, 10227, -10507, 10583, 10608, 10685, -11503, 11690
    ],["Tree-related Data Structures", 297, 1232, -11235, 11297, 11350, -11402, 12086, -12532
  ]]}]},

  {title:"Problem Solving Paradigms", arr:
  [{title:"Complete Search", arr:[
    ["Iterative (One Loop, Linear Scan)", 102, 256, -927, -1237, -10976, 11001, 11078
    ],["Iterative (Two Nested Loops)", 105, 347, 471, 617, 725, -1260, 10041, -10487, 10730, -11242, 12488, 12583
    ],["Iterative (Three or More Nested Loops, Easier)", 154, 188, -441, 626, 703, -735, -10102, 10502, 10662, 10908, 11059, 11975, 12498, 12515
    ],["Iterative (Three or More Nested Loops, Harder)", 253, 296, 386, 10125, 10177, 10360, 10365, 10483, -10660, 10973, 11108, -11236, 11342, 11548, -11565, 11804, 11959
    ],["Iterative (Fancy Techniques)", 140, 234, 435, 639, -1047, 1064, 11205, 11412, -11553, 11742, 12249, 12346, 12348, 12406, -12455
    ],["Recursive Backtracking (Easy)", 167, 380, 539, -624, 628, 677, 729, 750, 10276, 10344, 10452, -10576, -11085
    ],["Recursive Backtracking (Medium)", 222, 301, 331, 487, -524, 571, -574, 598, 775, 10001, 10063, 10460, 10475, -10503, 10506, 10950, 11201, 11961
    ],["Recursive Backtracking (Harder)", 129, 165, -193, 208, -416, 433, 565, 861, 868, -1262, 10094, 10128, 10582, 11090
  ]]},{title:"Dynamic Programming", arr:[
    ["Max 1D Range Sum", 507, -787, -10684, -10755
    ],["Max 2D Range Sum", -108, 836, 983, 10074, 10667, -10827, -11951
    ],["Longest Increasing Subsequence (LIS)", 111, 231, 437, -481, 497, 1196, 10131, 10534, 11368, -11456, -11790
    ],["0-1 Knapsack (Subset Sum)", 562, 990, 1213, 10130, 10261, -10616, 10664, -10819, 11003, 11341, -11566, 11658
    ],["Coin Change (CC)", 147, 166, -357, 674, -10306, 10313, 11137, -11517
    ],["Traveling Salesman Problem (TSP)", -216, -10496, -11284
    ],["Non Classical (The Easier Ones)", 116, 196, 1261, 10003, 10036, 10086, -10337, 10400, 10446, 10465, 10520, 10688, -10721, 10910, 10912, -10943, 10980, 11026, 11407, 11420, 11450, 11703
  ]]},{title:"Greedy", arr:[
    ["Classical, Usually Easier", 410, 1193, 10020, 10382, -11264, -11389, 12321, -12405
    ],["Involving Sorting (Or The Input Is Already Sorted)", 10026, 10037, 10249, 10670, 10763, 10785, -11100, 11103, 11269, -11292, 11369, 11729, 11900, -12210, 12485
    ],["Non Classical, Usually Harder", 311, 668, 10152, 10340, 10440, 10602, -10656, 10672, 10700, 10714, -10718, 10982, 11054, -11157, 11230, 11240, 11335, 11520, 11532, 11567, 12482
  ]]},{title:"Divide and Conquer", arr:[
    ["Binary Search", 679, 957, 10077, 10474, -10567, 10611, 10706, 10742, -11057, 11621, 11701, 11876, -12192
    ],["Binary Search the Answer", -10341, -11413, 11881, 11935, -12032, 12190
    ],["Other Divide and Conquer Problems", -183
  ]]}]},

  {title:"Graph", arr:
  [{title:"Graph Traversal", arr:[
    ["Just Graph Traversal", 118, 168, 280, 318, 614, 824, 10113, 10116, 10377, 10687, -11831, 11902, -11906, 12376, -12442, 12582
    ],["Flood Fill/Finding Connected Components", 260, 352, 459, 469, 572, 657, 722, 758, 776, 782, 784, 785, 852, 871, -1103, 10336, 10707, 10946, -11094, 11110, 11244, 11470, 11518, 11561, 11749, -11953
    ],["Topological Sort", 124, 200, -872, -10305, -11060, 11686
    ],["Bipartite Graph Check", -10004, 10505, -11080, -11396
    ],["Finding Articulation Points/Bridges", -315, 610, -796, 10199, -10765
    ],["Finding Strongly Connected Components", -247, 1229, 10731, -11504, 11709, 11770, -11838
  ]]},{title:"Minimum Spanning Tree", arr:[
    ["Standard", 908, 1174, 1208, 1235, 10034, -11228, -11631, 11710, 11733, -11747, 11857
    ],["Variants", 534, 544, 1160, 1216, 1234, -10048, 10099, 10147, -10369, 10397, 10462, -10600, 10842
  ]]},{title:"Single-Source Shortest Paths (SSSP)", arr:[
    ["On Unweighted Graph: BFS, Easier", 336, 383, 388, -429, 627, 762, -924, 1148, 10009, 10422, 10610, -10653, 10959
    ],["On Unweighted Graph: BFS, Harder", -314, 532, 859, 949, 10044, 10067, 10150, 10977, 11049, -11101, 11352, 11624, 11792, -12160
    ],["On Weighted Graph: Dijkstra's, Easier", -929, -1112, 10389, -10986
    ],["On Weighted Graph: Dijkstra's, Harder", 1202, 10166, 10187, 10278, 10356, 10603, -10801, 10967, 11338, 11367, 11377, -11492, 11833, -12047, 12144
    ],["On Graph with Negative Weight Cycle: Bellman Ford's", -558, -10449, -10557, 11280
  ]]},{title:"All-Pairs Shortest Paths", arr:[
    ["Standard", 341, 423, 567, -821, 1233, 1247, -10171, 10354, 10525, 10724, 10793, 10803, 10947, 11015, -11463, 12319
    ],["Variants", -104, 125, 186, 274, 436, -334, 869, 925, -1056, 1198, 11047
  ]]},{title:"Network Flow", arr:[
    ["Standard Max Flow Problem (Edmonds Karp's)", -259, -820, 10092, 10511, 10779, 11045, -11167, 11418
    ],["Variants", 10330, 10480, -11380, -11506, -12125
  ]]},{title:"Special Graphs (Others)", arr:[
    ["Tree", 112, 115, 122, 536, 548, 615, 699, 712, 839, 10308, -10459, 10701, -10805, 11131, 11234, 11615, -11695, 12186, 12347
    ],["Eulerian Graph", 117, 291, -10054, 10129, -10203, -10596
    ],["Bipartite Graph", 663, 670, 753, 1194, 10080, -10349, -11138, -11159, 11419, 12083, 12168
  ]]},{title:"Special Graph (Directed Acyclic Graph)", arr:[
    ["Single-Source Shortest/Longest Paths on DAG", 103, -452, 10000, 10051, 10259, -10285, -10350
    ],["Counting Paths in DAG", 825, 926, 986, -988, -10401, 10926, 11067, 11655, -11957
    ],["Converting General Graph to DAG", 590, -907, 910, 10201, 10543, 10681, 10702, 10874, -10913, 11307, -11487, 11545, 11782
  ]]}]},

  {title:"Mathematics", arr:
  [{title:"Ad Hoc Mathematics Problems", arr:[
    ["The Simpler Ones", 10055, 10071, 10281, 10469, -10773, 11614, -11723, 11805, -11875, 12149, 12502
    ],["Mathematical Simulation (Brute Force), easier", 100, 371, -382, 834, 906, -1225, 10035, -10346, 10370, 10783, 10879, 11150, 11247, 11313, 11689, 11877, 11934, 12290, 12527
    ],["Mathematical Simulation (Brute Force), harder", 493, 550, -616, 697, 846, 10025, 10257, 10624, -11130, -11254, 11968
    ],["Finding Pattern or Formula, easier", 10014, 10170, 10499, 10696, -10751, -10940, 11202, -12004, 12027
    ],["Finding Pattern or Formula, harder", 651, 913, -10161, 10493, 10509, 10666, 10693, 10710, 10882, 10970, 10994, -11231, 11246, 11296, 11298, 11387, 11393, -11718
    ],["Grid", -264, 808, 880, -10182, -10233, 10620, 10642, 10964
    ],["Number Systems or Sequences", 136, 138, 413, -443, 640, 694, 962, 974, 10006, -10042, 10049, 10101, -10408, 10930, 11028, 11063, 11461, 11660, 11970
    ],["Logarithm, Exponentiation, Power", 107, 113, 474, 545, -701, 1185, -10916, 11384, 11556, 11636, 11666, 11714, -11847, 11986, 12416
    ],["Polynomial", 126, 392, -498, 10215, -10268, 10302, 10326, -10586, 10719, 11692
    ],["Base Number Variants", -377, -575, 636, 10093, 10677, -10931, 11005, 11121, 11398, 12602
    ],["Just Ad Hoc", 276, 496, 613, -10137, 10190, 11055, 11241, -11526, 11715, 11816, -12036
  ]]},{title:"Java BigInteger Class", arr:[
    ["Basic Features", 424, 465, 619, -713, 748, 1226, 10013, 10083, 10106, 10198, 10430, 10433, 10494, 10519, -10523, 10669, 10925, 10992, 11448, 11664, 11830, -11879, 12143, 12459
    ],["Bonus Features: Base Number Conversion", 290, -343, 355, -389, 446, 10473, -10551, 11185, 11952
    ],["Bonus Features: Primality Testing", 960, -1210, -10235, 10924, -11287, 12542
    ],["Bonus Features: Others", -1230, 10023, 10193, 10464, -10814, -11821
  ]]},{title:"Combinatorics", arr:[
    ["Fibonacci Numbers", 495, 580, -763, 900, 948, 1258, 10183, -10334, 10450, 10497, 10579, -10689, 10862, 11000, 11089, 11161, 11780
    ],["Binomial Coefficients", 326, 369, 485, 530, 911, 10105, -10219, 10375, 10532, -10541, -11955
    ],["Catalan Numbers", -991, -10007, 10223, 10303, -10312, 10643
    ],["Others, Easier", 11115, -11310, -11401, 11480, -11597, 11609, 12463
    ],["Other, Harder", 1224, 10079, 10359, 10733, -10784, 10790, 10918, -11069, 11204, 11270, -11538, 11554, 12022
  ]]},{title:"Number Theory", arr:[
    ["Prime Numbers", 406, -543, 686, 897, 914, -10140, 10168, 10311, -10394, 10490, 10650, 10852, 10948, 11752
    ],["GCD and/or LCM", 106, 332, 408, 412, -10407, -10892, 11388, 11417, 11774, -11827, 12068
    ],["Factorial", -324, 568, -623, 10220, 10323, -10338
    ],["Finding Prime Factors", -516, -583, 10392, -11466
    ],["Working with Prime Factors", 160, 993, 10061, -10139, 10484, 10527, 10622, -10680, 10780, 10791, 11347, 11395, -11889
    ],["Functions involving Prime Factors", -294, 884, 1246, -10179, 10299, 10820, 10958, 11064, 11086, 11226, 11353, -11728, 12005
    ],["Modified Sieve", -10699, -10738, -10990, 11327, 12043
    ],["Modulo Arithmetic", 128, -374, 10127, 10174, -10176, -10212, 10489, 11029
    ],["Extended Euclid", -10090, -10104, 10633, -10673
    ],["Other Number Theory Problems", 547, 756, -10110, 10922, 10929, 11042, -11344, -11371
  ]]},{title:"Probability Theory", arr:[
    ["Standard", 542, 10056, 10218, 10238, 10328, -10491, -10759, 10777, 11021, -11176, 11181, 11346, 11500, 11628, 12024, 12114, 12457, 12461
  ]]},{title:"Cycle-Finding", arr:[
    ["Standard", 202, 275, -350, 944, 10162, 10515, 10591, 11036, -11053, 11549, -11634, 12464
  ]]},{title:"Game Theory", arr:[
    ["Standard", 847, -10111, 10165, 10368, 10404, 10578, -11311, -11489, 12293, 12469
  ]]}]},

  {title:"String Processing", arr:
  [{title:"Ad Hoc String Processing Problems - Part 1", arr:[
    ["Cipher/Encode/Encrypt/Decode/Decrypt, Easier", 245, 306, 444, 458, 483, 492, 641, 739, 795, 865, 10019, 10222, -10851, -10878, 10896, 10921, 11220, -11278, 11541, 11716, 11787, 11946
    ],["Cipher/Encode/Encrypt/Decode/Decrypt, Harder", 213, 468, -554, 632, 726, 740, 741, 850, 856, -11385, -11697
    ],["Frequency Counting", 499, 895, -902, 10008, 10062, -10252, 10293, 10374, 10420, 10625, 10789, -11203, 11577
    ],["Input Parsing (Non Recursive)", 271, 327, 391, 397, 442, 486, 537, 1200, -10906, 11148, -11357, -11878, 12543
    ],["Input Parsing (Recursive)", 384, 464, 620, -622, 743, -10854, 11070, -11291
    ],["Solvable with Java String/Pattern class (Regular Expression)", -325, -494, 576, -10058
  ]]},{title:"Ad Hoc String Processing Problems - Part 2", arr:[
    ["Output Formatting", 110, 159, 320, 330, 338, 373, 426, 445, -488, 490, 570, 645, 890, 1219, 10333, 10500, 10761, -10800, 10875, 10894, 11074, 11482, 11965, -12155, 12364
    ],["String Comparison", 409, -644, 671, 912, -11048, -11056, 11233, 11713, 11734
    ],["Just Ad Hoc", 153, 263, 892, -941, 1215, 1239, 10115, 10126, 10197, 10361, 10391, -10393, 10508, 10679, -11452, 11483, 11839, 11962, 12243, 12414
  ]]},{title:"String Matching", arr:[
    ["Standard", 455, 886, -10298, 11362, -11475, -11576, 11888, 12467
    ],["In 2D Grid", -422, 604, 736, -10010, -11283
  ]]},{title:"String Processing with Dynamic Programming", arr:[
    ["Classic", 164, -526, 531, 1207, 10066, 10100, -10192, 10405, -10635, 10739
    ],["Non Classic", 257, 10453, 10617, -11022, -11151, -11258, 11552, 
  ]]},{title:"Suffix Trie, Tree, Array", arr:[
    ["Standard", 719, -760, 1223, 1254, -11107, -11512
  ]]}]},

  {title:"(Computational) Geometry", arr:
  [{title:"Basic Geometry - Part 1", arr:[
    ["Points and Lines", 152, 191, 378, 587, 833, 837, -920, 1249, 10242, 10250, -10263, 10357, 10466, 10585, 10832, 10865, 10902, -10927, 11068, 11343, 11505, 11519, 11894
    ],["Triangles (plus Circles)", 121, 143, 190, 375, 438, 10195, 10210, 10286, 10347, 10387, 10522, -10577, 10792, 10991, -11152, 11164, 11281, 11326, 11437, 11479, 11579, 11854, -11909, 11936
  ]]},{title:"Basic Geometry - Part 2", arr:[
    ["Circles (only)", 1388, -10005, 10136, 10180, 10209, 10221, 10283, 10432, 10451, 10573, -10589, -10678, 12578
    ],["Quadrilaterals", 155, -460, 476, 477, -11207, 11345, 11455, 11639, 11800, -11834, 12256
    ],["3D Objects", -737, -815, -10297
  ]]},{title:"Polygon", arr:[
    ["Standard", 109, 137, 218, 361, 478, 596, 634, 681, 858, -1111, 1206, 10002, 10060, 10065, 10112, 10406, -10652, 11096, -11265, 11447, 11473, 11626
  ]]}]},

  {title:"More Advanced Topics", arr:
  [{title:"More Advanced Search Techniques", arr:[
    ["More Challenging Backtracking Problems", 131, 710, 711, 989, 1052, -10309, 10318, 10890, 10957, -11195, -11065, 11127, 11464, 11471
    ],["More Challenging State-Space Search with BFS or Dijkstra's", 321, 658, 928, -985, 1057, 1251, 1253, 10047, 10097, 10923, -11198, -11329, 11513, 11974, 12135
    ],["Meet in the Middle/A*/IDA*", 652, -1098, 1217, -10181, 11163, -11212
  ]]},{title:"Problem Decomposition", arr:[
    ["Two Components - Binary Search the Answer and Other", 714, 1221, 1280, 10372, 10566, 10606, 10668, 10804, 10816, -10983, -11262, -11516, 11646, 12428
    ],["Two Components - Involving DP 1D RSQ/RMQ", 967, 10200, 10533, 10871, -10891, -11105, -11408, 11491, 12028
    ],["Two Components - Graph Preprocessing and DP", -976, 10917, 10937, 10944, -11324, -11405, 11693, 11813
    ],["Two Components - Involving Graph", 273, 521, 1039, -1092, 1243, 1263, 10075, 10307, 11267, -11635, 11721, 11730, 12070, 12101, -12159
    ],["Two Components - Involving Mathematics", 1195, 10325, 10427, -10539, -10637, -10717, 11282, 11415, 11428
    ],["Two Components - Complete Search and Geometry", 142, 184, 201, 270, 356, 638, 688, -10012, 10167, 10301, 10310, 10823, -11227, 11515, -11574
    ],["Two Components - Mixed with Efficient Data Structure", 843, 922, 10734, -11474, -11525, -11960, 11966, 11967, 12318, 12460
    ],["Three Components", -295, 811, -1040, 1079, 1093, 1250, 10856, 10876, -11610
  ]]},{title:"More Advanced DP Techniques", arr:[
    ["DP level 2", -1172, -1211, 10069, 10081, 10364, 10419, 10536, 10651, 10690, 10898, -10911, 11088, 11832, 11218, 12324
    ],["DP level 3", 607, 702, 812, 882, -1231, -1238, 1240, 1244, 10029, 10032, 10154, 10163, 10164, 10271, 10304, 10604, 10645, 10817, 11002, 11084, 11285, -11391, 12030
    ],["DP level 4", 473, -1099, -1220, 1222, -1252, 10149, 10482, 10626, 10722, 11125, 11133, 11432, 11472
  ]]}]},

  {title:"Rare Topics", arr:
  [{title:"Rare Algorithms", arr:[
    ["Dinic's Algorithm", -11167
    ],["Formulas or Theorems", 10088, 10178, -10213, -10720, 10843, 11414, -11719
    ],["Gaussian Elimination", -11319
    ],["Great-Circle Distance", -535, -10316, 10897, -11817
    ],["Hopcroft Karp's Algorithm", -11138
    ],["Kosaraju's Algorithm", -11838
    ],["Matrix Power", 10229, -10518, -10655, 10870, -11486, 12470
    ],["Pollard's rho Integer Factoring Algorithm", -11476
    ],["Sliding Window", -1121, -11536
  ]]},{title:"Rare Problems", arr:[
    ["2-SAT Problem", -10319
    ],["Art Gallery Problem", -588, -10078, -10243
    ],["Bitonic TSP", -1096, -1347
    ],["Bracket Matching", -551, -673, -11111
    ],["Chinese Postman Problem", -10296
    ],["Closest Pair Problem", -10245, -11378
    ],["Graph Matching (non-bipartite)", -11439
    ],["Independent and Edge Disjoint Paths", -563, -1242
    ],["Inversion Index", 299, -612, -10327, 10810, 11495, -11858
    ],["Josephus Problem", 130, 133, 151, 305, 402, 440, 10015, -10771, -10774, -11351
    ],["Knight Moves", -439, -11643
    ],["Lowest Common Ancestor", -10938, -12238
    ],["Magic Square Construction (odd size)", -1266
    ],["Matrix Chain Multiplication", -348
    ],["Min Cost (Max) Flow", 10594, -10746, 10806, -10888, -11301
    ],["Min Path Cover on DAG", -1184, -1201
    ],["Pancake Sorting", -120
    ],["Postfix Calculator and Conversion", -727
    ],["Roman Numerals", -344, 759, -11616, -12397
    ],["Sorting in Linear Time", -11462
    ],["Tower of Hanoi", -10017
  ]]}]}
])

.factory('cpbook_parse_problems', function () {
  return function (chapters) {
    var problems = [];
    for (var cc = 0; cc < chapters.length; cc++) {
      var c = chapters[cc];
      for (var i = 0; i < c.arr.length; i++) {
        var sc = c.arr[i];
        for (var j = 0; j < sc.arr.length; j++) {
          var ssc = sc.arr[j];
          for (var k = 1; k < ssc.length; k++) {
            problems.push(ssc[k]);
          }
        }
      }
    }
    return problems;
  };
})

.factory('cpbook1_numbers', function (cpbook_1ed, cpbook_parse_problems) { return cpbook_parse_problems(cpbook_1ed); })
.factory('cpbook2_numbers', function (cpbook_2ed, cpbook_parse_problems) { return cpbook_parse_problems(cpbook_2ed); })
.factory('cpbook3_numbers', function (cpbook_3ed, cpbook_parse_problems) { return cpbook_parse_problems(cpbook_3ed); })

.factory('cpbook_db', function (create_uhunt_db) {
  return create_uhunt_db('cpbook', {
    'show': 'string',
    'chapter': 'int',
    'edition': 'int',
  });
})

.directive('uhuntCpbook', function (uhunt, uhunt_util, cpbook_db, uhunt_problems, cpbook_1ed, cpbook_2ed, cpbook_3ed) {
  return {
    replace: true,
    // scope: { number:'=uhuntProblemSearch', show:'=', hide:'=', search:'=', },
    templateUrl: 'partials/cpbook.html',
    link: function (scope, element, attrs) {
      console.time('CpBookCtrl');
      var cpbook_chapters = [ cpbook_1ed, cpbook_2ed, cpbook_3ed ];
      var nth = ['1st', '2nd', '3rd'];
      var color = ['blue', 'brown', 'green'];
      var img = ['images/cp.jpg', 'images/cp2-small.png', 'images/cp3.png'];
      var link = [
        'http://www.lulu.com/product/paperback/competitive-programming/12110025',
        'http://www.lulu.com/product/paperback/competitive-programming-2/16377304',
        'http://www.lulu.com/shop/steven-halim/competitive-programming-3/paperback/product-21031836.html'
      ];
      scope.color1 = color[0];
      scope.color2 = color[1];
      scope.color3 = color[2];
      scope.edition = Math.min(2, cpbook_db.exists('edition') ? cpbook_db.get('edition') : 2);
      scope.chapter = cpbook_db.get('chapter') || -1;
      scope.show_chapter_type = cpbook_db.get('show') || 'Starred'; // Starred or Everything.

      function apply_edition() {
        scope.nth_ed = nth[scope.edition];
        scope.lulu_link = link[scope.edition];
        scope.cpbook_image = img[scope.edition];
        scope.other_ed = nth[1 - scope.edition];
        scope.other_color = color[1 - scope.edition];
        scope.chapters = cpbook_chapters[scope.edition];
        scope.build_sections();
        cpbook_db.set('edition', scope.edition);
      }

      scope.set_chapter = function (chapter, type) {
        if (type) {
          cpbook_db.set('show', type);
          scope.show_chapter_type = type;
        }
        if (scope.chapter === chapter && !type) {
          scope.chapter = -1;
        } else {
          scope.chapter = chapter;
        }
        scope.build_sections();
        cpbook_db.set('chapter', scope.chapter);
      };

      scope.is_selected_and = function (type, index) { return scope.chapter == index && scope.show_chapter_type == type; };
      scope.not_is_selected_and = function (type, index) { return !scope.is_selected_and(type, index); };

      scope.build_sections = function () {
        // console.log('build_sections chapter = ' + scope.chapter + '; problems ready = ' + uhunt_problems.ready());
        if (scope.chapter < 0 || !uhunt_problems.ready()) return;
        var c = scope.chapters[scope.chapter];
        if (!c) return;
        var sections = [];
        for (var i = 0, LN = 0, RN = 0; i < c.arr.length; i++) {
          var sc = c.arr[i], nsolved = 0, ntotal = 0, nhead = 0, s = [];
          for (var j = 0; j < sc.arr.length; j++) {
            var ssc = sc.arr[j], ss = [], sub_solved = 0, sub_total = 0; nhead++;
            for (var k = 1; k < ssc.length; k++) {
              if (scope.show_chapter_type == 'Starred' && ssc[k] > 0) continue;
              var p = uhunt_problems.num(Math.abs(ssc[k]));
              if (!p) continue;
              var st = uhunt.user.stats(p.pid);
              var status = '<b>--- ? ---</b>', ntry = st.ntry;
              if (st.ac){
                status = '<b><tt style="color:green">&#x2714; '+
                  uhunt_util.format_ms(st.mrun) + 's/' + (st.rank < 10000 ? st.rank : '&gt;10K');
                if (ntry > 0) status += '(' + ntry + ')';
                status += '</tt></b>';
                nsolved++;
                sub_solved++;
              } else if (ntry>0){
                status = '<b style="color:orange">Tried (' + ntry + ')</b>';
              }
              ss.push({
                status: '&nbsp;' + status, p: p, starred: ssc[k] < 0,
                level: 10 - Math.floor(Math.min(10, Math.log(p.dacu? p.dacu : 1)))
              });
              ntotal++;
              sub_total++;
            }
            s.push({
              title : '&nbsp;' + ssc[0] + ' <tt>(' + sub_solved + '/' + sub_total + ')</tt>',
              sections: ss,
            });
          }
          sections.push({
            float: LN <= RN ? 'left' : 'right',
            section_title: sc.title + ' <tt>(' + nsolved + '/' + ntotal + ' = ' + Math.floor(nsolved/ntotal*100)+'%)</tt>',
            sections: s,
          });
          ntotal += nhead;
          if (LN <= RN) LN += ntotal; else RN += ntotal;
        }
        scope.sections = sections;
      }

      scope.switch_edition = function(ed) {
        scope.edition = ed;
        apply_edition();
      };

      scope.uhunt_problems = uhunt_problems;
      apply_edition();
      scope.$watch('uhunt_problems.version', scope.build_sections);
      uhunt.user.on('update', scope.build_sections);

      scope.percentage = function (c, show) {
        var solved = 0, total = 0;
        for (var i=0; i<c.arr.length; i++){
          var sc = c.arr[i];
          for (var j=0; j<sc.arr.length; j++){
            var ssc = sc.arr[j];
            for (var k=1; k<ssc.length; k++){
              if (show == 'Starred' && ssc[k] > 0) continue;
              var p = uhunt_problems.num(Math.abs(ssc[k]));
              if (!p) continue;
              if (uhunt.user.stats(p.pid).ac) solved++;
              total++;
            }
          }
        }
        return Math.floor(solved * 100 / total);
      };
      console.timeEnd('CpBookCtrl');
    }
  };
})

;
