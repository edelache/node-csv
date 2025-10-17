import "should";
import { parse } from "../lib/index.js";

describe("Option `duplicate_header_suffix`", function () {
  it("require columns to be active", function () {
    (() => {
      parse("", { duplicate_header_suffix: true });
    }).should.throw({
      code: "CSV_INVALID_OPTION_DUPLICATE_HEADER_SUFFIX",
      message:
        "Invalid option duplicate_header_suffix: the `columns` mode must be activated.",
    });
  });

  it("when false (default behavior)", function (next) {
    parse(
      "a,b,a,c\n1,2,3,4\n5,6,7,8",
      {
        columns: true,
        duplicate_header_suffix: false,
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          { a: "3", b: "2", c: "4" },
          { a: "7", b: "6", c: "8" },
        ]);
        next();
      },
    );
  });

  it("when true (default suffix)", function (next) {
    parse(
      "a,b,a,c\n1,2,3,4\n5,6,7,8",
      {
        columns: true,
        duplicate_header_suffix: true,
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          { a: "1", b: "2", a_2: "3", c: "4" },
          { a: "5", b: "6", a_2: "7", c: "8" },
        ]);
        next();
      },
    );
  });


  it("with multiple duplicates", function (next) {
    parse(
      "a,b,a,c,a\n1,2,3,4,5\n6,7,8,9,10",
      {
        columns: true,
        duplicate_header_suffix: true,
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          { a: "1", b: "2", a_2: "3", c: "4", a_3: "5" },
          { a: "6", b: "7", a_2: "8", c: "9", a_3: "10" },
        ]);
        next();
      },
    );
  });

  it("with empty column names", function (next) {
    parse(
      ",,,\n1,2,3,4\n5,6,7,8",
      {
        columns: true,
        duplicate_header_suffix: true,
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          { "": "1", "_2": "2", "_3": "3", "_4": "4" },
          { "": "5", "_2": "6", "_3": "7", "_4": "8" },
        ]);
        next();
      },
    );
  });

  it("with array columns", function (next) {
    const columns = ["a", "b", "a", "c"];
    parse(
      "1,2,3,4\n5,6,7,8",
      {
        columns: columns,
        duplicate_header_suffix: true,
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          { a: "1", b: "2", a_2: "3", c: "4" },
          { a: "5", b: "6", a_2: "7", c: "8" },
        ]);
        next();
      },
    );
  });

  it("with camelCase option name", function (next) {
    parse(
      "a,b,a,c\n1,2,3,4\n5,6,7,8",
      {
        columns: true,
        duplicateHeaderSuffix: true,
      },
      (err, records) => {
        if (err) return next(err);
        records.should.eql([
          { a: "1", b: "2", a_2: "3", c: "4" },
          { a: "5", b: "6", a_2: "7", c: "8" },
        ]);
        next();
      },
    );
  });

  it("should throw error for invalid type", function () {
    (() => {
      parse("", { columns: true, duplicate_header_suffix: 123 });
    }).should.throw({
      code: "CSV_INVALID_OPTION_DUPLICATE_HEADER_SUFFIX",
      message:
        "Invalid option duplicate_header_suffix: expect a boolean value, got 123",
    });
  });
});
