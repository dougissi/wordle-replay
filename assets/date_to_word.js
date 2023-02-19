const dateToWord = new Map([
    ['2021-06-19', 'cigar'],
    ['2021-06-20', 'rebut'],
    ['2021-06-21', 'sissy'],
    ['2021-06-22', 'humph'],
    ['2021-06-23', 'awake'],
    ['2021-06-24', 'blush'],
    ['2021-06-25', 'focal'],
    ['2021-06-26', 'evade'],
    ['2021-06-27', 'naval'],
    ['2021-06-28', 'serve'],
    ['2021-06-29', 'heath'],
    ['2021-06-30', 'dwarf'],
    ['2021-07-01', 'model'],
    ['2021-07-02', 'karma'],
    ['2021-07-03', 'stink'],
    ['2021-07-04', 'grade'],
    ['2021-07-05', 'quiet'],
    ['2021-07-06', 'bench'],
    ['2021-07-07', 'abate'],
    ['2021-07-08', 'feign'],
    ['2021-07-09', 'major'],
    ['2021-07-10', 'death'],
    ['2021-07-11', 'fresh'],
    ['2021-07-12', 'crust'],
    ['2021-07-13', 'stool'],
    ['2021-07-14', 'colon'],
    ['2021-07-15', 'abase'],
    ['2021-07-16', 'marry'],
    ['2021-07-17', 'react'],
    ['2021-07-18', 'batty'],
    ['2021-07-19', 'pride'],
    ['2021-07-20', 'floss'],
    ['2021-07-21', 'helix'],
    ['2021-07-22', 'croak'],
    ['2021-07-23', 'staff'],
    ['2021-07-24', 'paper'],
    ['2021-07-25', 'unfed'],
    ['2021-07-26', 'whelp'],
    ['2021-07-27', 'trawl'],
    ['2021-07-28', 'outdo'],
    ['2021-07-29', 'adobe'],
    ['2021-07-30', 'crazy'],
    ['2021-07-31', 'sower'],
    ['2021-08-01', 'repay'],
    ['2021-08-02', 'digit'],
    ['2021-08-03', 'crate'],
    ['2021-08-04', 'cluck'],
    ['2021-08-05', 'spike'],
    ['2021-08-06', 'mimic'],
    ['2021-08-07', 'pound'],
    ['2021-08-08', 'maxim'],
    ['2021-08-09', 'linen'],
    ['2021-08-10', 'unmet'],
    ['2021-08-11', 'flesh'],
    ['2021-08-12', 'booby'],
    ['2021-08-13', 'forth'],
    ['2021-08-14', 'first'],
    ['2021-08-15', 'stand'],
    ['2021-08-16', 'belly'],
    ['2021-08-17', 'ivory'],
    ['2021-08-18', 'seedy'],
    ['2021-08-19', 'print'],
    ['2021-08-20', 'yearn'],
    ['2021-08-21', 'drain'],
    ['2021-08-22', 'bribe'],
    ['2021-08-23', 'stout'],
    ['2021-08-24', 'panel'],
    ['2021-08-25', 'crass'],
    ['2021-08-26', 'flume'],
    ['2021-08-27', 'offal'],
    ['2021-08-28', 'agree'],
    ['2021-08-29', 'error'],
    ['2021-08-30', 'swirl'],
    ['2021-08-31', 'argue'],
    ['2021-09-01', 'bleed'],
    ['2021-09-02', 'delta'],
    ['2021-09-03', 'flick'],
    ['2021-09-04', 'totem'],
    ['2021-09-05', 'wooer'],
    ['2021-09-06', 'front'],
    ['2021-09-07', 'shrub'],
    ['2021-09-08', 'parry'],
    ['2021-09-09', 'biome'],
    ['2021-09-10', 'lapel'],
    ['2021-09-11', 'start'],
    ['2021-09-12', 'greet'],
    ['2021-09-13', 'goner'],
    ['2021-09-14', 'golem'],
    ['2021-09-15', 'lusty'],
    ['2021-09-16', 'loopy'],
    ['2021-09-17', 'round'],
    ['2021-09-18', 'audit'],
    ['2021-09-19', 'lying'],
    ['2021-09-20', 'gamma'],
    ['2021-09-21', 'labor'],
    ['2021-09-22', 'islet'],
    ['2021-09-23', 'civic'],
    ['2021-09-24', 'forge'],
    ['2021-09-25', 'corny'],
    ['2021-09-26', 'moult'],
    ['2021-09-27', 'basic'],
    ['2021-09-28', 'salad'],
    ['2021-09-29', 'agate'],
    ['2021-09-30', 'spicy'],
    ['2021-10-01', 'spray'],
    ['2021-10-02', 'essay'],
    ['2021-10-03', 'fjord'],
    ['2021-10-04', 'spend'],
    ['2021-10-05', 'kebab'],
    ['2021-10-06', 'guild'],
    ['2021-10-07', 'aback'],
    ['2021-10-08', 'motor'],
    ['2021-10-09', 'alone'],
    ['2021-10-10', 'hatch'],
    ['2021-10-11', 'hyper'],
    ['2021-10-12', 'thumb'],
    ['2021-10-13', 'dowry'],
    ['2021-10-14', 'ought'],
    ['2021-10-15', 'belch'],
    ['2021-10-16', 'dutch'],
    ['2021-10-17', 'pilot'],
    ['2021-10-18', 'tweed'],
    ['2021-10-19', 'comet'],
    ['2021-10-20', 'jaunt'],
    ['2021-10-21', 'enema'],
    ['2021-10-22', 'steed'],
    ['2021-10-23', 'abyss'],
    ['2021-10-24', 'growl'],
    ['2021-10-25', 'fling'],
    ['2021-10-26', 'dozen'],
    ['2021-10-27', 'boozy'],
    ['2021-10-28', 'erode'],
    ['2021-10-29', 'world'],
    ['2021-10-30', 'gouge'],
    ['2021-10-31', 'click'],
    ['2021-11-01', 'briar'],
    ['2021-11-02', 'great'],
    ['2021-11-03', 'altar'],
    ['2021-11-04', 'pulpy'],
    ['2021-11-05', 'blurt'],
    ['2021-11-06', 'coast'],
    ['2021-11-07', 'duchy'],
    ['2021-11-08', 'groin'],
    ['2021-11-09', 'fixer'],
    ['2021-11-10', 'group'],
    ['2021-11-11', 'rogue'],
    ['2021-11-12', 'badly'],
    ['2021-11-13', 'smart'],
    ['2021-11-14', 'pithy'],
    ['2021-11-15', 'gaudy'],
    ['2021-11-16', 'chill'],
    ['2021-11-17', 'heron'],
    ['2021-11-18', 'vodka'],
    ['2021-11-19', 'finer'],
    ['2021-11-20', 'surer'],
    ['2021-11-21', 'radio'],
    ['2021-11-22', 'rouge'],
    ['2021-11-23', 'perch'],
    ['2021-11-24', 'retch'],
    ['2021-11-25', 'wrote'],
    ['2021-11-26', 'clock'],
    ['2021-11-27', 'tilde'],
    ['2021-11-28', 'store'],
    ['2021-11-29', 'prove'],
    ['2021-11-30', 'bring'],
    ['2021-12-01', 'solve'],
    ['2021-12-02', 'cheat'],
    ['2021-12-03', 'grime'],
    ['2021-12-04', 'exult'],
    ['2021-12-05', 'usher'],
    ['2021-12-06', 'epoch'],
    ['2021-12-07', 'triad'],
    ['2021-12-08', 'break'],
    ['2021-12-09', 'rhino'],
    ['2021-12-10', 'viral'],
    ['2021-12-11', 'conic'],
    ['2021-12-12', 'masse'],
    ['2021-12-13', 'sonic'],
    ['2021-12-14', 'vital'],
    ['2021-12-15', 'trace'],
    ['2021-12-16', 'using'],
    ['2021-12-17', 'peach'],
    ['2021-12-18', 'champ'],
    ['2021-12-19', 'baton'],
    ['2021-12-20', 'brake'],
    ['2021-12-21', 'pluck'],
    ['2021-12-22', 'craze'],
    ['2021-12-23', 'gripe'],
    ['2021-12-24', 'weary'],
    ['2021-12-25', 'picky'],
    ['2021-12-26', 'acute'],
    ['2021-12-27', 'ferry'],
    ['2021-12-28', 'aside'],
    ['2021-12-29', 'tapir'],
    ['2021-12-30', 'troll'],
    ['2021-12-31', 'unify'],
    ['2022-01-01', 'rebus'],
    ['2022-01-02', 'boost'],
    ['2022-01-03', 'truss'],
    ['2022-01-04', 'siege'],
    ['2022-01-05', 'tiger'],
    ['2022-01-06', 'banal'],
    ['2022-01-07', 'slump'],
    ['2022-01-08', 'crank'],
    ['2022-01-09', 'gorge'],
    ['2022-01-10', 'query'],
    ['2022-01-11', 'drink'],
    ['2022-01-12', 'favor'],
    ['2022-01-13', 'abbey'],
    ['2022-01-14', 'tangy'],
    ['2022-01-15', 'panic'],
    ['2022-01-16', 'solar'],
    ['2022-01-17', 'shire'],
    ['2022-01-18', 'proxy'],
    ['2022-01-19', 'point'],
    ['2022-01-20', 'robot'],
    ['2022-01-21', 'prick'],
    ['2022-01-22', 'wince'],
    ['2022-01-23', 'crimp'],
    ['2022-01-24', 'knoll'],
    ['2022-01-25', 'sugar'],
    ['2022-01-26', 'whack'],
    ['2022-01-27', 'mount'],
    ['2022-01-28', 'perky'],
    ['2022-01-29', 'could'],
    ['2022-01-30', 'wrung'],
    ['2022-01-31', 'light'],
    ['2022-02-01', 'those'],
    ['2022-02-02', 'moist'],
    ['2022-02-03', 'shard'],
    ['2022-02-04', 'pleat'],
    ['2022-02-05', 'aloft'],
    ['2022-02-06', 'skill'],
    ['2022-02-07', 'elder'],
    ['2022-02-08', 'frame'],
    ['2022-02-09', 'humor'],
    ['2022-02-10', 'pause'],
    ['2022-02-11', 'ulcer'],
    ['2022-02-12', 'ultra'],
    ['2022-02-13', 'robin'],
    ['2022-02-14', 'cynic'],
    ['2022-02-15', 'aroma'],
    ['2022-02-16', 'caulk'],
    ['2022-02-17', 'shake'],
    ['2022-02-18', 'dodge'],
    ['2022-02-19', 'swill'],
    ['2022-02-20', 'tacit'],
    ['2022-02-21', 'other'],
    ['2022-02-22', 'thorn'],
    ['2022-02-23', 'trove'],
    ['2022-02-24', 'bloke'],
    ['2022-02-25', 'vivid'],
    ['2022-02-26', 'spill'],
    ['2022-02-27', 'chant'],
    ['2022-02-28', 'choke'],
    ['2022-03-01', 'rupee'],
    ['2022-03-02', 'nasty'],
    ['2022-03-03', 'mourn'],
    ['2022-03-04', 'ahead'],
    ['2022-03-05', 'brine'],
    ['2022-03-06', 'cloth'],
    ['2022-03-07', 'hoard'],
    ['2022-03-08', 'sweet'],
    ['2022-03-09', 'month'],
    ['2022-03-10', 'lapse'],
    ['2022-03-11', 'watch'],
    ['2022-03-12', 'today'],
    ['2022-03-13', 'focus'],
    ['2022-03-14', 'smelt'],
    ['2022-03-15', 'tease'],
    ['2022-03-16', 'cater'],
    ['2022-03-17', 'movie'],
    ['2022-03-18', 'saute'],
    ['2022-03-19', 'allow'],
    ['2022-03-20', 'renew'],
    ['2022-03-21', 'their'],
    ['2022-03-22', 'slosh'],
    ['2022-03-23', 'purge'],
    ['2022-03-24', 'chest'],
    ['2022-03-25', 'depot'],
    ['2022-03-26', 'epoxy'],
    ['2022-03-27', 'nymph'],
    ['2022-03-28', 'found'],
    ['2022-03-29', 'shall'],
    ['2022-03-30', 'stove'],
    ['2022-03-31', 'lowly'],
    ['2022-04-01', 'snout'],
    ['2022-04-02', 'trope'],
    ['2022-04-03', 'fewer'],
    ['2022-04-04', 'shawl'],
    ['2022-04-05', 'natal'],
    ['2022-04-06', 'comma'],
    ['2022-04-07', 'foray'],
    ['2022-04-08', 'scare'],
    ['2022-04-09', 'stair'],
    ['2022-04-10', 'black'],
    ['2022-04-11', 'squad'],
    ['2022-04-12', 'royal'],
    ['2022-04-13', 'chunk'],
    ['2022-04-14', 'mince'],
    ['2022-04-15', 'shame'],
    ['2022-04-16', 'cheek'],
    ['2022-04-17', 'ample'],
    ['2022-04-18', 'flair'],
    ['2022-04-19', 'foyer'],
    ['2022-04-20', 'cargo'],
    ['2022-04-21', 'oxide'],
    ['2022-04-22', 'plant'],
    ['2022-04-23', 'olive'],
    ['2022-04-24', 'inert'],
    ['2022-04-25', 'askew'],
    ['2022-04-26', 'heist'],
    ['2022-04-27', 'shown'],
    ['2022-04-28', 'zesty'],
    ['2022-04-29', 'trash'],
    ['2022-04-30', 'larva'],
    ['2022-05-01', 'forgo'],
    ['2022-05-02', 'story'],
    ['2022-05-03', 'hairy'],
    ['2022-05-04', 'train'],
    ['2022-05-05', 'homer'],
    ['2022-05-06', 'badge'],
    ['2022-05-07', 'midst'],
    ['2022-05-08', 'canny'],
    ['2022-05-09', 'shine'],
    ['2022-05-10', 'gecko'],
    ['2022-05-11', 'farce'],
    ['2022-05-12', 'slung'],
    ['2022-05-13', 'tipsy'],
    ['2022-05-14', 'metal'],
    ['2022-05-15', 'yield'],
    ['2022-05-16', 'delve'],
    ['2022-05-17', 'being'],
    ['2022-05-18', 'scour'],
    ['2022-05-19', 'glass'],
    ['2022-05-20', 'gamer'],
    ['2022-05-21', 'scrap'],
    ['2022-05-22', 'money'],
    ['2022-05-23', 'hinge'],
    ['2022-05-24', 'album'],
    ['2022-05-25', 'vouch'],
    ['2022-05-26', 'asset'],
    ['2022-05-27', 'tiara'],
    ['2022-05-28', 'crept'],
    ['2022-05-29', 'bayou'],
    ['2022-05-30', 'atoll'],
    ['2022-05-31', 'manor'],
    ['2022-06-01', 'creak'],
    ['2022-06-02', 'showy'],
    ['2022-06-03', 'phase'],
    ['2022-06-04', 'froth'],
    ['2022-06-05', 'depth'],
    ['2022-06-06', 'gloom'],
    ['2022-06-07', 'flood'],
    ['2022-06-08', 'trait'],
    ['2022-06-09', 'girth'],
    ['2022-06-10', 'piety'],
    ['2022-06-11', 'goose'],
    ['2022-06-12', 'float'],
    ['2022-06-13', 'donor'],
    ['2022-06-14', 'atone'],
    ['2022-06-15', 'primo'],
    ['2022-06-16', 'apron'],
    ['2022-06-17', 'blown'],
    ['2022-06-18', 'cacao'],
    ['2022-06-19', 'loser'],
    ['2022-06-20', 'input'],
    ['2022-06-21', 'gloat'],
    ['2022-06-22', 'awful'],
    ['2022-06-23', 'brink'],
    ['2022-06-24', 'smite'],
    ['2022-06-25', 'beady'],
    ['2022-06-26', 'rusty'],
    ['2022-06-27', 'retro'],
    ['2022-06-28', 'droll'],
    ['2022-06-29', 'gawky'],
    ['2022-06-30', 'hutch'],
    ['2022-07-01', 'pinto'],
    ['2022-07-02', 'egret'],
    ['2022-07-03', 'lilac'],
    ['2022-07-04', 'sever'],
    ['2022-07-05', 'field'],
    ['2022-07-06', 'fluff'],
    ['2022-07-07', 'agape'],
    ['2022-07-08', 'voice'],
    ['2022-07-09', 'stead'],
    ['2022-07-10', 'berth'],
    ['2022-07-11', 'madam'],
    ['2022-07-12', 'night'],
    ['2022-07-13', 'bland'],
    ['2022-07-14', 'liver'],
    ['2022-07-15', 'wedge'],
    ['2022-07-16', 'roomy'],
    ['2022-07-17', 'wacky'],
    ['2022-07-18', 'flock'],
    ['2022-07-19', 'angry'],
    ['2022-07-20', 'trite'],
    ['2022-07-21', 'aphid'],
    ['2022-07-22', 'tryst'],
    ['2022-07-23', 'midge'],
    ['2022-07-24', 'power'],
    ['2022-07-25', 'elope'],
    ['2022-07-26', 'cinch'],
    ['2022-07-27', 'motto'],
    ['2022-07-28', 'stomp'],
    ['2022-07-29', 'upset'],
    ['2022-07-30', 'bluff'],
    ['2022-07-31', 'cramp'],
    ['2022-08-01', 'quart'],
    ['2022-08-02', 'coyly'],
    ['2022-08-03', 'youth'],
    ['2022-08-04', 'rhyme'],
    ['2022-08-05', 'buggy'],
    ['2022-08-06', 'alien'],
    ['2022-08-07', 'smear'],
    ['2022-08-08', 'unfit'],
    ['2022-08-09', 'patty'],
    ['2022-08-10', 'cling'],
    ['2022-08-11', 'glean'],
    ['2022-08-12', 'label'],
    ['2022-08-13', 'hunky'],
    ['2022-08-14', 'khaki'],
    ['2022-08-15', 'poker'],
    ['2022-08-16', 'gruel'],
    ['2022-08-17', 'twice'],
    ['2022-08-18', 'twang'],
    ['2022-08-19', 'shrug'],
    ['2022-08-20', 'treat'],
    ['2022-08-21', 'waste'],
    ['2022-08-22', 'merit'],
    ['2022-08-23', 'woven'],
    ['2022-08-24', 'needy'],
    ['2022-08-25', 'clown'],
    ['2022-08-26', 'irony'],
    ['2022-08-27', 'ruder'],
    ['2022-08-28', 'gauze'],
    ['2022-08-29', 'chief'],
    ['2022-08-30', 'onset'],
    ['2022-08-31', 'prize'],
    ['2022-09-01', 'fungi'],
    ['2022-09-02', 'charm'],
    ['2022-09-03', 'gully'],
    ['2022-09-04', 'inter'],
    ['2022-09-05', 'whoop'],
    ['2022-09-06', 'taunt'],
    ['2022-09-07', 'leery'],
    ['2022-09-08', 'class'],
    ['2022-09-09', 'theme'],
    ['2022-09-10', 'lofty'],
    ['2022-09-11', 'tibia'],
    ['2022-09-12', 'booze'],
    ['2022-09-13', 'alpha'],
    ['2022-09-14', 'thyme'],
    ['2022-09-15', 'doubt'],
    ['2022-09-16', 'parer'],
    ['2022-09-17', 'chute'],
    ['2022-09-18', 'stick'],
    ['2022-09-19', 'trice'],
    ['2022-09-20', 'alike'],
    ['2022-09-21', 'recap'],
    ['2022-09-22', 'saint'],
    ['2022-09-23', 'glory'],
    ['2022-09-24', 'grate'],
    ['2022-09-25', 'admit'],
    ['2022-09-26', 'brisk'],
    ['2022-09-27', 'soggy'],
    ['2022-09-28', 'usurp'],
    ['2022-09-29', 'scald'],
    ['2022-09-30', 'scorn'],
    ['2022-10-01', 'leave'],
    ['2022-10-02', 'twine'],
    ['2022-10-03', 'sting'],
    ['2022-10-04', 'bough'],
    ['2022-10-05', 'marsh'],
    ['2022-10-06', 'sloth'],
    ['2022-10-07', 'dandy'],
    ['2022-10-08', 'vigor'],
    ['2022-10-09', 'howdy'],
    ['2022-10-10', 'enjoy'],
    ['2022-10-11', 'valid'],
    ['2022-10-12', 'ionic'],
    ['2022-10-13', 'equal'],
    ['2022-10-14', 'floor'],
    ['2022-10-15', 'catch'],
    ['2022-10-16', 'spade'],
    ['2022-10-17', 'stein'],
    ['2022-10-18', 'exist'],
    ['2022-10-19', 'quirk'],
    ['2022-10-20', 'denim'],
    ['2022-10-21', 'grove'],
    ['2022-10-22', 'spiel'],
    ['2022-10-23', 'mummy'],
    ['2022-10-24', 'fault'],
    ['2022-10-25', 'foggy'],
    ['2022-10-26', 'flout'],
    ['2022-10-27', 'carry'],
    ['2022-10-28', 'sneak'],
    ['2022-10-29', 'libel'],
    ['2022-10-30', 'waltz'],
    ['2022-10-31', 'aptly'],
    ['2022-11-01', 'piney'],
    ['2022-11-02', 'inept'],
    ['2022-11-03', 'aloud'],
    ['2022-11-04', 'photo'],
    ['2022-11-05', 'dream'],
    ['2022-11-06', 'stale'],
    ['2022-11-07', 'begin'],
    ['2022-11-08', 'spell'],
    ['2022-11-09', 'rainy'],
    ['2022-11-10', 'unite'],
    ['2022-11-11', 'medal'],
    ['2022-11-12', 'valet'],
    ['2022-11-13', 'inane'],
    ['2022-11-14', 'maple'],
    ['2022-11-15', 'snarl'],
    ['2022-11-16', 'baker'],
    ['2022-11-17', 'there'],
    ['2022-11-18', 'glyph'],
    ['2022-11-19', 'avert'],
    ['2022-11-20', 'brave'],
    ['2022-11-21', 'axiom'],
    ['2022-11-22', 'prime'],
    ['2022-11-23', 'drive'],
    ['2022-11-24', 'feast'],
    ['2022-11-25', 'itchy'],
    ['2022-11-26', 'clean'],
    ['2022-11-27', 'happy'],
    ['2022-11-28', 'tepid'],
    ['2022-11-29', 'undue'],
    ['2022-11-30', 'study'],
    ['2022-12-01', 'eject'],
    ['2022-12-02', 'chafe'],
    ['2022-12-03', 'torso'],
    ['2022-12-04', 'adore'],
    ['2022-12-05', 'woken'],
    ['2022-12-06', 'amber'],
    ['2022-12-07', 'joust'],
    ['2022-12-08', 'infer'],
    ['2022-12-09', 'braid'],
    ['2022-12-10', 'knock'],
    ['2022-12-11', 'naive'],
    ['2022-12-12', 'apply'],
    ['2022-12-13', 'spoke'],
    ['2022-12-14', 'usual'],
    ['2022-12-15', 'rival'],
    ['2022-12-16', 'probe'],
    ['2022-12-17', 'chord'],
    ['2022-12-18', 'taper'],
    ['2022-12-19', 'slate'],
    ['2022-12-20', 'third'],
    ['2022-12-21', 'lunar'],
    ['2022-12-22', 'excel'],
    ['2022-12-23', 'aorta'],
    ['2022-12-24', 'poise'],
    ['2022-12-25', 'extra'],
    ['2022-12-26', 'judge'],
    ['2022-12-27', 'condo'],
    ['2022-12-28', 'impel'],
    ['2022-12-29', 'havoc'],
    ['2022-12-30', 'molar'],
    ['2022-12-31', 'manly'],
    ['2023-01-01', 'whine'],
    ['2023-01-02', 'skirt'],
    ['2023-01-03', 'antic'],
    ['2023-01-04', 'layer'],
    ['2023-01-05', 'sleek'],
    ['2023-01-06', 'belie'],
    ['2023-01-07', 'lemon'],
    ['2023-01-08', 'opera'],
    ['2023-01-09', 'pixie'],
    ['2023-01-10', 'grimy'],
    ['2023-01-11', 'sedan'],
    ['2023-01-12', 'leapt'],
    ['2023-01-13', 'human'],
    ['2023-01-14', 'koala'],
    ['2023-01-15', 'spire'],
    ['2023-01-16', 'frock'],
    ['2023-01-17', 'adopt'],
    ['2023-01-18', 'chard'],
    ['2023-01-19', 'mucky'],
    ['2023-01-20', 'alter'],
    ['2023-01-21', 'blurb'],
    ['2023-01-22', 'matey'],
    ['2023-01-23', 'elude'],
    ['2023-01-24', 'count'],
    ['2023-01-25', 'maize'],
    ['2023-01-26', 'beefy'],
    ['2023-01-27', 'worry'],
    ['2023-01-28', 'flirt'],
    ['2023-01-29', 'fishy'],
    ['2023-01-30', 'crave'],
    ['2023-01-31', 'cross'],
    ['2023-02-01', 'scold'],
    ['2023-02-02', 'shirk'],
    ['2023-02-03', 'tasty'],
    ['2023-02-04', 'unlit'],
    ['2023-02-05', 'dance'],
    ['2023-02-06', 'ninth'],
    ['2023-02-07', 'apple'],
    ['2023-02-08', 'flail'],
    ['2023-02-09', 'stage'],
    ['2023-02-10', 'heady'],
    ['2023-02-11', 'debug'],
    ['2023-02-12', 'giant'],
    ['2023-02-13', 'usage'],
    ['2023-02-14', 'sound'],
    ['2023-02-15', 'salsa'],
    ['2023-02-16', 'magic'],
    ['2023-02-17', 'cache'],
    ['2023-02-18', 'avail'],
    ['2023-02-19', 'kiosk'],
    ['2023-02-20', 'sweat'],
])
