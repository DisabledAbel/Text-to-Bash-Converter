import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Trash2, Code2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TechConverter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { toast } = useToast();

  const convertToBash = (text: string) => {
    if (!text.trim()) {
      setOutput("");
      return;
    }
    setOutput("```bash\n" + text + "\n```");
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    convertToBash(value);
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
                    bash
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
            <div className="min-h-[300px] bg-card rounded-md border border-border overflow-hidden">
              {output ? (
                <div className="p-4 bg-card">
                  <div className="bg-code-bg rounded-md border border-border overflow-x-auto">
                    <div className="flex items-center justify-between px-4 py-2 bg-secondary/50 border-b border-border">
                      <span className="text-xs text-muted-foreground font-mono">bash</span>
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
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center space-y-2">
                    <Code2 className="h-12 w-12 mx-auto opacity-50" />
                    <p className="text-sm">GitHub preview will appear here</p>
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