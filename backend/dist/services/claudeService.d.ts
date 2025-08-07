export interface CodeGenerationRequest {
    projectName: string;
    projectDescription: string;
    framework: 'react-typescript' | 'nextjs' | 'vue' | 'node-express' | 'python-flask' | 'python-fastapi';
    features: string[];
    complexity: 'simple' | 'moderate' | 'complex';
    includeBackend: boolean;
}
export interface FileStructure {
    name: string;
    type: 'file' | 'folder';
    content?: string;
    children?: FileStructure[];
    isOpen?: boolean;
}
export interface GeneratedCodebase {
    name: string;
    description: string;
    files: FileStructure[];
}
declare class ClaudeService {
    private client;
    constructor();
    generateCodebase(request: CodeGenerationRequest): Promise<GeneratedCodebase>;
    private buildCodeGenerationPrompt;
    private parseCodebaseResponse;
    generateProjectIdeas(count?: number): Promise<Array<{
        name: string;
        description: string;
        features: string[];
        complexity: string;
    }>>;
}
export declare const claudeService: ClaudeService;
export {};
//# sourceMappingURL=claudeService.d.ts.map