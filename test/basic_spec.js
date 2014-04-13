describe("Basic testing includes reading of different files", function () {
    var fs = require('fs');
    var MultiIni = require('../lib/multi-ini-class.js');

    it("Availability of the class ", function () {
        expect(MultiIni).not.toBeUndefined();
        expect(MultiIni).not.toBeNull();
    });

    it("Read a basic with a section and 2 simple keys and a comment", function () {
        var data = MultiIni.read('test/data/single.ini')

        expect(data).not.toBeNull();

        expect(data['section1']).toBeDefined();

        expect(data['section1']['key1']).toBe('value1');

        expect(data['section1']['key2']).toBe('value2');
    });

    it("Read a basic with a section with multi line values", function () {
        var data = MultiIni.read('test/data/multi_line.ini');

        expect(data).not.toBeNull();

        expect(data['section1']).toBeDefined();

        // test first value
        expect(data['section1']['key1']).toBe('value1');

        // multi line parsing should stop to fetch key5
        expect(data['section1']['key5']).toBe('value5');

        expect(data['section1']['key2']).toBe('line1\nline2');

        expect(data['section1']['key3']).toBe('\nline2\nline3');

        expect(data['section1']['key4']).toBe('\nline2\nline3\n');
    });

    it("Read a basic with a section with multi level keys and single and multi line values", function () {
        var data = MultiIni.read('test/data/multi_level_line.ini');

        expect(data).not.toBeNull();

        expect(data['section1']).toBeDefined();

        // check for the second level
        expect(data['section1']['key1']).toBeDefined();
        expect(data['section1']['key1']['subkey1']).toBe('value1');
        expect(data['section1']['key1']['subkey2']).toBe('value2');

        // check the third level
        expect(data['section1']['key2']).toBeDefined();
        expect(data['section1']['key2']['subkey1']['subkey1']).toBe('value3');
        expect(data['section1']['key2']['subkey1']['subkey2']).toBe('value4');

        expect(data['section1']['key2']['subkey2']).toBe('value5');

        expect(data['section1']['key2']['subkey3']).toBeDefined();
        expect(data['section1']['key2']['subkey3']['subkey1']).toBe('value6');

        // multi line parsing with second level
        expect(data['section1']['key3']).toBeDefined();
        expect(data['section1']['key3']['subkey1']).toBe('line1\nline2');
        expect(data['section1']['key3']['subkey2']).toBe('\nline2\nline3');
        expect(data['section1']['key3']['subkey3']).toBe('\nline2\nline3\n');

        // multi line parsing with third level
        expect(data['section1']['key4']).toBeDefined();
        expect(data['section1']['key4']['subkey1']).toBeDefined();
        expect(data['section1']['key4']['subkey1']['subkey1']).toBe('line1\nline2');
        expect(data['section1']['key4']['subkey1']['subkey2']).toBe('\nline2\nline3');
        expect(data['section1']['key4']['subkey1']['subkey3']).toBe('\nline2\nline3\n');

        expect(data['section1']['key4']['subkey2']).toBe('value');
    });

    it("Read ini with array definitions", function () {
        var data = MultiIni.read('test/data/array.ini');

        expect(data).not.toBeNull();
        expect(data['section1']).toBeDefined();

        // array in key
        expect(data['section1']['key1']).toBeDefined();
        expect(data['section1']['key1'].length).toBe(2);
        expect(data['section1']['key1'][0]).toBe('value1');
        expect(data['section1']['key1'][1]).toBe('value2');

        // normal key value
        expect(data['section1']['key2']).toBe('value3');

        // array in subkey
        expect(data['section1']['key3']).toBeDefined();
        expect(data['section1']['key3']['subkey']).toBeDefined();
        expect(data['section1']['key3']['subkey'].length).toBe(2);
        expect(data['section1']['key3']['subkey'][0]).toBe('value4');
        expect(data['section1']['key3']['subkey'][1]).toBe('value5');

    });

    it("Write ini file with one section and multiple single line values", function () {
        var data = {
            section1: {
                key1: 'value1',
                key2: 'value2'
            }
        };

        MultiIni.write('test/out/single.ini', data);

        var content = fs.readFileSync('test/out/single.ini', {encoding: 'utf8'});
        var expectedContent = fs.readFileSync('test/data/result/single.ini', {encoding: 'utf8'});

        expect(content).toBe(expectedContent);
    });

    it("Write ini file with one section and multiple multi level single line values", function () {
        var data = {
            section1: {
                key1: {
                    subkey1: 'value1',
                    subkey2: 'value2'
                },
                key2: {
                    subkey: 'value3'
                }
            }
        };

        MultiIni.write('test/out/multi_level.ini', data);

        var content = fs.readFileSync('test/out/multi_level.ini', {encoding: 'utf8'});
        var expectedContent = fs.readFileSync('test/data/result/multi_level.ini', {encoding: 'utf8'});

        expect(content).toBe(expectedContent);
    });

    it("Write a file with single and multi level and array definitions", function () {
        var data = {
            section1: {
                key1: {
                    subkey1: ['value1', 'value2'],
                    subkey2: 'value3'
                },
                key2: ['value4', 'value5']
            }
        };

        MultiIni.write('test/out/array.ini', data);

        var content = fs.readFileSync('test/out/array.ini', {encoding: 'utf8'});
        var expectedContent = fs.readFileSync('test/data/result/array.ini', {encoding: 'utf8'});

        expect(content).toBe(expectedContent);
    });

    it("Write a file with single and multi level with multi line", function () {
        var data = {
            section1: {
                key1: {
                    subkey1: 'line1\nline2',
                    subkey2: '\nline2',
                    subkey3: '\nline2\n',
                    subkey4: 'value1'
                },
                key2: 'line1\nline2',
                key3: '\nline2',
                key4: '\nline2\n',
                key5: 'value2'
            }
        };

        MultiIni.write('test/out/multi_line.ini', data);

        var content = fs.readFileSync('test/out/multi_line.ini', {encoding: 'utf8'});
        var expectedContent = fs.readFileSync('test/data/result/multi_line.ini', {encoding: 'utf8'});

        expect(content).toBe(expectedContent);
    });

    it("Write a file with single and multi level, multi line and array", function () {
        var data = {
            section1: {
                key1: {
                    subkey1: ['line1\nline2', '\nline2', '\nline2\n', 'value1'],
                    subkey2: 'value2'
                },
                key2: ['line1\nline2', '\nline2', '\nline2\n', 'value3'],
                key3: 'value4'
            }
        };

        MultiIni.write('test/out/all.ini', data);

        var content = fs.readFileSync('test/out/all.ini', {encoding: 'utf8'});
        var expectedContent = fs.readFileSync('test/data/result/all.ini', {encoding: 'utf8'});

        expect(content).toBe(expectedContent);
    });

    it("Write a ascii ini file and write it manuel", function () {
        var data = {
            section: {
                key: "Straße mit Häusern"
            }
        };

        MultiIni.write('test/out/ascii.ini', data, {encoding: 'ascii'});
        fs.writeFileSync('test/out/ascii_serialized.ini', MultiIni.serialize(data), {encoding: 'ascii'});


        var content = fs.readFileSync('test/out/ascii.ini', {encoding: 'ascii'});
        var expectedContent = fs.readFileSync('test/out/ascii_serialized.ini', {encoding: 'ascii'});

        expect(content).toBe(expectedContent);
    });

//    it("Compare both reading results, via ini and manuel", function () {
//        var data = {
//            section: {
//                key: "Straße mit Häusern"
//            }
//        };
//
//        MultiIni.write('test/out/ascii_read_write.ini', data, {encoding: 'ascii'});
//
//        var content = MultiIni.read('test/out/ascii_read_write.ini', {encoding: 'ascii'});
//
//        expect(content.section.key).toBe(data.section.key);
//    });

    it("Read a file with an invalid lines ignoring it", function () {
        var data = MultiIni.read('test/data/invalid_line.ini')

        expect(data).not.toBeNull();

        expect(data['section']).toBeDefined();

        expect(data['section']['valid']).toBe('valid');

        expect(data['section']['invalid']).not.toBeDefined();

        expect(data['section']['invalid_multiline']).not.toBeDefined();
    });

    it("Read a file with an invalid lines reading it", function () {
        var data = MultiIni.read('test/data/invalid_line.ini', {ignore_invalid: false})

        expect(data).not.toBeNull();

        expect(data['section']).toBeDefined();

        expect(data['section']['valid']).toBe('valid');

        expect(data['section']['invalid']).toBe('invalid');

        expect(data['section']['invalid_multiline']).toBe('line1\nline2\nline3');
    });

    it("Read a file with an invalid with invalid callback and abort", function () {
        var cb = function (line) {
            expect(line).toBe('invalid="invalid"a')
            return false
        };
        var data = MultiIni.read('test/data/invalid_line.ini', {ignore_invalid: false, oninvalid: cb})

        expect(data).toBeUndefined();
    });

});