#!/usr/bin/env node
const fs = require('fs');
const util = require('util');

//Method 2 Promisify
// const lstat = util.promisify(fs.lstat);

//Method 3 
// const lstat = fs.promises.lstat
// or
// const {lstat} = fs.promises;

fs.readdir(process.cwd(), (err, filenames) => {
  if (err) {
    console.log(err);
  } 
  //Solution 1
  //  const allStats = Array(filenames.length).fill(null);
  //  for(let filename of filenames) {
  //    const index = filenames.indexOf(filename);
  //    fs.lstat(filename, (err, stats) => {
  //      if (err) {
  //        console.log(err);
  //      }

  //       allStats[index] = stats;

  //       const ready = allStats.every((stats) => {
  //         return stats
  //      }); 

  //      if (ready) {
  //        allStats.forEach((stats, index) => {
  //          console.log(filenames[index], stats.isFile());
  //        })
  //      }
  //    });
  //  }

  //Solution 2
  const lstat = (filename) => {
    //Method 1 Promise
    // return new Promise((resolve, reject) => {
    //   fs.lstat(filename, (err, stats) => {
    //     if (err) {
    //       reject(err);
    //     }
    //     resolve(stats);
    //   })
    // });


  };
});