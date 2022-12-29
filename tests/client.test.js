// Requrie's
const mlog = require("mocha-logger");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

// Global vars
chai.use(chaiAsPromised);
const { expect } = chai;
const fork = require("child_process").fork;

/**
 * Fork a node process and pass in the command line user input
 * @param {string} input - simulated user command line input
 * @returns {Promise} - resolves when response is finished or client closes
 */
const sendData = (input) => new Promise(resolve => {
  let questionCount = 0;
  let response = "";

  const childClient = fork("src/client.js", [], {
    stdio: 'pipe'
  });

  childClient.on('close', (code) => {
    mlog.log(`Child process exited with code ${code}.`);
    resolve(response);
  });

  childClient.on('error', (error) => {
    mlog.error(error);
  });

  childClient.stdout.on('data', (data) => {
    response += `${data}`;

    if (`${data}`.search("What character") >= 0) {
      questionCount += 1;
    }

    if (questionCount >= 2) {
      resolve(response);
    }
  });

  childClient.stdin.write(`${input}\n`);
});

describe("Testing clients", () => {
  describe("Client 1", () => {
    it("should return one result for 'Luke'", async () => {
      const result = await sendData("Luke");
      expect(result).to.contain("(1/1) Luke Skywalker - [A New Hope, The Empire Strikes Back, Return of the Jedi, Revenge of the Sith]");
    });
  });

  describe("Client 2", () => {
    it("should return three results for 'Dar'", async () => {
      const result = await sendData("Dar");
      expect(result).to.contain("(1/3) Darth Vader - [A New Hope, The Empire Strikes Back, Return of the Jedi, Revenge of the Sith]");
      expect(result).to.contain("(2/3) Biggs Darklighter - [A New Hope]");
      expect(result).to.contain("(3/3) Darth Maul - [The Phantom Menace]");
    });
  });

  describe("Client 3", () => {
    it("should return five results for 'Ki'", async () => {
      const result = await sendData("Ki");
      expect(result).to.contain("(1/5) Anakin Skywalker - [The Phantom Menace, Attack of the Clones, Revenge of the Sith]");
      expect(result).to.contain("(2/5) Wilhuff Tarkin - [A New Hope, Revenge of the Sith]");
      expect(result).to.contain("(3/5) Jek Tono Porkins - [A New Hope]");
      expect(result).to.contain("(4/5) Ki-Adi-Mundi - [The Phantom Menace, Attack of the Clones, Revenge of the Sith]");
      expect(result).to.contain("(5/5) Kit Fisto - [The Phantom Menace, Attack of the Clones, Revenge of the Sith]");
    });
  });

  describe("Client 4", () => {
    it("should return an error message for 'wrong'", async () => {
      const result = await sendData("wrong");
      expect(result).to.contain("ERR: No valid matches retrieved for query 'wrong'");
    });
  });
});
