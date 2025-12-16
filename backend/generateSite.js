const { spawn } = require("child_process");

function generateWebsite(data) {
  return new Promise((resolve, reject) => {
    const geminiPath = `${process.env.APPDATA}\\npm\\gemini.cmd`;

    const prompt = `
OUTPUT RULES:
- Output ONLY valid HTML
- Start with <!DOCTYPE html>
- End with </html>
- No explanations
- No markdown
- No extra text

TASK:
Create a modern, responsive SINGLE-PAGE business website using Tailwind CSS CDN.

Business Name: ${data.name}
Business Type: ${data.type}
Location: ${data.location}
Phone/WhatsApp: ${data.phone}
Products/Services: ${data.products}

SECTIONS:
- Navbar
- Hero
- About
- Products
- WhatsApp button
- Contact
- Footer
`.trim();

    const child = spawn(geminiPath, [], { shell: true });

    let output = "";
    let errorOutput = "";

    // 🔥 SEND PROMPT VIA STDIN
    child.stdin.write(prompt);
    child.stdin.end();

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    child.on("close", () => {
      // 🔥 HARD HTML EXTRACTION
      const match =
        output.match(/<!DOCTYPE html[\s\S]*?<\/html>/i) ||
        output.match(/<html[\s\S]*?<\/html>/i);

      if (!match) {
        console.error("❌ RAW GEMINI OUTPUT ↓↓↓");
        console.error(output);
        console.error("❌ RAW GEMINI OUTPUT ↑↑↑");
        reject("HTML not generated");
        return;
      }

      let html = match[0];

      if (!html.toLowerCase().startsWith("<!doctype")) {
        html = "<!DOCTYPE html>\n" + html;
      }

      resolve(html);
    });
  });
}

module.exports = generateWebsite;
