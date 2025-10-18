import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Copy, Trash2, Code2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import githubPreviewImage from "@/assets/github-preview.png";

type OutputFormat = 
  | "bash" 
  | "typescript" 
  | "javascript" 
  | "python" 
  | "markdown"
  | "java"
  | "go"
  | "rust"
  | "ruby"
  | "php"
  | "cpp"
  | "csharp"
  | "sql"
  | "yaml"
  | "json"
  | "html"
  | "css"
  | "shell"
  | "swift"
  | "kotlin"
  | "dockerfile"
  | "m3u"
  | "perl"
  | "scala"
  | "haskell"
  | "elixir"
  | "clojure"
  | "groovy"
  | "lua"
  | "r"
  | "julia"
  | "dart"
  | "vb"
  | "fortran"
  | "cobol"
  | "assembly"
  | "pascal"
  | "scheme"
  | "erlang"
  | "fsharp"
  | "ocaml"
  | "solidity"
  | "vyper"
  | "toml"
  | "ini"
  | "xml"
  | "graphql"
  | "protobuf"
  | "powershell"
  | "batch"
  | "zsh"
  | "fish"
  | "scss"
  | "sass"
  | "less"
  | "stylus"
  | "jsx"
  | "tsx"
  | "latex"
  | "diff"
  | "log"
  | "properties"
  | "nginx"
  | "apache"
  | "makefile"
  | "cmake"
  | "gradle"
  | "vue"
  | "svelte"
  | "astro"
  | "zig"
  | "nim"
  | "crystal"
  | "reason"
  | "purescript"
  | "elm"
  | "coffeescript"
  | "livescript"
  | "actionscript"
  | "apex"
  | "abap"
  | "ada"
  | "prolog"
  | "tcl"
  | "vhdl"
  | "verilog"
  | "matlab"
  | "octave"
  | "scilab"
  | "maxima"
  | "mathematica"
  | "wolfram"
  | "sas"
  | "stata"
  | "spss";

const TechConverter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("bash");
  const [formatSearch, setFormatSearch] = useState("");
  const { toast } = useToast();

  const formats = [
    { value: "bash", label: "Bash" },
    { value: "typescript", label: "TypeScript" },
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "ruby", label: "Ruby" },
    { value: "php", label: "PHP" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "sql", label: "SQL" },
    { value: "shell", label: "Shell" },
    { value: "dockerfile", label: "Dockerfile" },
    { value: "m3u", label: "M3U" },
    { value: "markdown", label: "Markdown" },
    { value: "yaml", label: "YAML" },
    { value: "json", label: "JSON" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "perl", label: "Perl" },
    { value: "scala", label: "Scala" },
    { value: "haskell", label: "Haskell" },
    { value: "elixir", label: "Elixir" },
    { value: "clojure", label: "Clojure" },
    { value: "groovy", label: "Groovy" },
    { value: "lua", label: "Lua" },
    { value: "r", label: "R" },
    { value: "julia", label: "Julia" },
    { value: "dart", label: "Dart" },
    { value: "vb", label: "Visual Basic" },
    { value: "fortran", label: "Fortran" },
    { value: "cobol", label: "COBOL" },
    { value: "assembly", label: "Assembly" },
    { value: "pascal", label: "Pascal" },
    { value: "scheme", label: "Scheme" },
    { value: "erlang", label: "Erlang" },
    { value: "fsharp", label: "F#" },
    { value: "ocaml", label: "OCaml" },
    { value: "solidity", label: "Solidity" },
    { value: "vyper", label: "Vyper" },
    { value: "toml", label: "TOML" },
    { value: "ini", label: "INI" },
    { value: "xml", label: "XML" },
    { value: "graphql", label: "GraphQL" },
    { value: "protobuf", label: "Protobuf" },
    { value: "powershell", label: "PowerShell" },
    { value: "batch", label: "Batch" },
    { value: "zsh", label: "Zsh" },
    { value: "fish", label: "Fish" },
    { value: "scss", label: "SCSS" },
    { value: "sass", label: "Sass" },
    { value: "less", label: "Less" },
    { value: "stylus", label: "Stylus" },
    { value: "jsx", label: "JSX" },
    { value: "tsx", label: "TSX" },
    { value: "latex", label: "LaTeX" },
    { value: "diff", label: "Diff" },
    { value: "log", label: "Log" },
    { value: "properties", label: "Properties" },
    { value: "nginx", label: "Nginx" },
    { value: "apache", label: "Apache" },
    { value: "makefile", label: "Makefile" },
    { value: "cmake", label: "CMake" },
    { value: "gradle", label: "Gradle" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
    { value: "astro", label: "Astro" },
    { value: "zig", label: "Zig" },
    { value: "nim", label: "Nim" },
    { value: "crystal", label: "Crystal" },
    { value: "reason", label: "Reason" },
    { value: "purescript", label: "PureScript" },
    { value: "elm", label: "Elm" },
    { value: "coffeescript", label: "CoffeeScript" },
    { value: "livescript", label: "LiveScript" },
    { value: "actionscript", label: "ActionScript" },
    { value: "apex", label: "Apex" },
    { value: "abap", label: "ABAP" },
    { value: "ada", label: "Ada" },
    { value: "prolog", label: "Prolog" },
    { value: "tcl", label: "Tcl" },
    { value: "vhdl", label: "VHDL" },
    { value: "verilog", label: "Verilog" },
    { value: "matlab", label: "MATLAB" },
    { value: "octave", label: "Octave" },
    { value: "scilab", label: "Scilab" },
    { value: "maxima", label: "Maxima" },
    { value: "mathematica", label: "Mathematica" },
    { value: "wolfram", label: "Wolfram" },
    { value: "sas", label: "SAS" },
    { value: "stata", label: "Stata" },
    { value: "spss", label: "SPSS" },
  ];

  const filteredFormats = formats.filter(format =>
    format.label.toLowerCase().includes(formatSearch.toLowerCase())
  );

  const convertToCodeBlock = (text: string, format: OutputFormat) => {
    if (!text.trim()) {
      setOutput("");
      return;
    }
    
    // Split by newlines and filter out empty lines
    const commands = text.split("\n").filter(line => line.trim());
    
    // Create separate code blocks for each command
    const codeBlocks = commands.map(cmd => `\`\`\`${format}\n${cmd}\n\`\`\``);
    
    // Join with newlines between blocks
    setOutput(codeBlocks.join("\n\n"));
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    convertToCodeBlock(value, outputFormat);
  };

  const handleFormatChange = (format: OutputFormat) => {
    setOutputFormat(format);
    convertToCodeBlock(input, format);
  };

  const copyToClipboard = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      toast({
        title: "Copied!",
        description: "Code block copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Code2 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Tech to Bash Converter
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Convert your tech input into properly formatted bash code blocks
          </p>
        </div>

        {/* Main Content */}
        <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Input</h2>
              <Button
                variant="clear"
                size="sm"
                onClick={clearAll}
                disabled={!input}
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            </div>
            <Textarea
              placeholder="Enter your tech code, commands, or snippets here..."
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              className="min-h-[300px] font-mono text-sm bg-code-bg border-border resize-none focus:ring-primary"
              autoFocus
            />
          </Card>

          {/* Output Section */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Output</h2>
              <div className="flex items-center gap-2">
                <Select value={outputFormat} onValueChange={handleFormatChange}>
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <div 
                      className="flex items-center gap-2 px-2 pb-2 sticky top-0 bg-popover z-10 border-b border-border"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search formats..."
                        value={formatSearch}
                        onChange={(e) => setFormatSearch(e.target.value)}
                        className="h-8"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        onKeyDown={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        onBlur={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                      />
                    </div>
                    {filteredFormats.map(format => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                    {filteredFormats.length === 0 && (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No formats found
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <Button
                  variant="copy"
                  size="sm"
                  onClick={copyToClipboard}
                  disabled={!output}
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
            </div>
            <div className="relative">
              <Textarea
                value={output}
                readOnly
                className="min-h-[300px] font-mono text-sm bg-code-bg border-border resize-none"
                placeholder="Your formatted bash code block will appear here..."
              />
              {output && (
                <div className="absolute top-2 right-2">
                  <div className="bg-primary/20 text-primary text-xs px-2 py-1 rounded">
                    {outputFormat}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* GitHub Preview Section */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">GitHub Preview</h2>
              <div className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                How it looks on GitHub
              </div>
            </div>
            <div className="min-h-[400px] bg-card rounded-md border border-border overflow-hidden">
              {output ? (
                <div className="h-full flex flex-col">
                  <div className="p-4 bg-card">
                    <div className="bg-code-bg rounded-md border border-border overflow-x-auto">
                      <div className="flex items-center justify-between px-4 py-2 bg-secondary/50 border-b border-border">
                        <span className="text-xs text-muted-foreground font-mono">{outputFormat}</span>
                        <div className="flex gap-1">
                          <div className="w-3 h-3 rounded-full bg-destructive/40"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/40"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/40"></div>
                        </div>
                      </div>
                      <pre className="p-4 text-sm font-mono text-foreground overflow-x-auto">
                        <code>{input}</code>
                      </pre>
                    </div>
                  </div>
                  <div className="flex-1">
                    <img 
                      src={githubPreviewImage} 
                      alt="GitHub interface showing how code blocks appear"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <div className="text-center space-y-4 p-4">
                    <Code2 className="h-12 w-12 mx-auto opacity-50" />
                    <p className="text-sm">GitHub preview will appear here</p>
                  </div>
                  <div className="flex-1 w-full">
                    <img 
                      src={githubPreviewImage} 
                      alt="GitHub interface example"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm space-y-2">
          <p>Type or paste your code in the input area and see it formatted instantly</p>
          <p className="text-xs">The GitHub preview shows how your code block will render in issues, PRs, and README files</p>
        </div>
      </div>
    </div>
  );
};

export default TechConverter;