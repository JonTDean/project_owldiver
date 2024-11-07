<script lang="ts">
  import { scale, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { onMount, onDestroy } from 'svelte';
  import { bootState, bootComplete } from '$lib/stores/bootSequence';

  export let onComplete: () => void;
  export let mode: 'enter' | 'exit' = 'enter';

  let visible = true;
  let messages: string[] = [];
  let currentIndex = 0;
  let progress = 0;
  let terminalElement: HTMLElement | null = null;
  let isProcessing = false;

  const generateZkSnarkProofOutput = (): string[][] => [
    [
      '   ├─ [INFO] Initializing zkSNARK protocol parameters...',
      '   │   └─ Loaded elliptic curve configuration: BN-Quantum4096 (Advanced 4096-bit Barreto-Naehrig curve)',
      '   │   └─ Allocating 15 TB quantum RAM for cryptographic operations with adaptive load distribution.',
      '   │   └─ Quantum entropy pool initiated using certified Quantum TRNG (True Random Number Generator).',
      '   │   └─ Cryptographic library: QuantumShield-CryptoLib v9.84.7, quantum-certified for military operations.',
      '   │   └─ Entropy cross-referenced with multi-national defense clusters in temporal synchronization.',
      '   │   └─ [OK] zkSNARK parameters initialized with quantum-hard configurations.',
    ],
    [
      '   ├─ [STEP 1] Compiling arithmetic circuits for the statement to be proven...',
      '   │   └─ Parsing input statement: Confirming resource allocation protocol for advanced fleet operations.',
      '   │   └─ Circuit mapping initiated: 12 billion gates distributed across quantum processing threads.',
      '   │   └─ Synchronizing logic paths with AI-guided temporal cross-checks.',
      '   │   └─ Quantum ALUs engaged for parallel computation across 500,000 superconducting cores.',
      '   │   └─ Memory utilization monitored at 0.001% of 15 TB quantum RAM.',
      '   │   └─ Redundancy validation performed with AI-based self-healing consistency checks.',
      '   │   └─ [OK] Circuit compiled successfully. Prepared for quantum-verified witness generation.',
    ],
    [
      '   ├─ [STEP 2] Generating trusted setup via multi-party computation (MPC)...',
      '   │   └─ Establishing quantum-secure multi-party exchange with post-quantum encryption (TLS-Q 4.0).',
      '   │   └─ Validating participant authenticity through biometric and holographic quantum identity protocols.',
      '   │   └─ Integrating entropy from interstellar cryptographic alliances: Defense Grid Omega and Quantum Cryptographic Institute.',
      '   │   └─ Shamir\'s Secret Sharing employed with quantum entanglement for distributed key integrity.',
      '   │   └─ Continuous monitoring for cross-dimensional adversarial influence: No anomalies detected.',
      '   │   └─ [COMPLETE] Trusted setup finalized with tamper-proof quantum ledger notarization.',
    ],
    [
      '   ├─ [STEP 3] Creating proving and verification keys...',
      '   │   └─ Constructing proving key from MPC output with advanced quantum coherence verification.',
      '   │   └─ Key material integrity confirmed with KYBER-SHA-4096 quantum checks.',
      '   │   └─ Serialization of verification key completed, optimized for 10,240 qubit data structures.',
      '   │   └─ Keys secured in a quantum-locked cryptographic vault with temporal access constraints.',
      '   │   └─ [OK] Proving and verification keys generated and recorded with quantum-entangled audit trails.',
    ],
    [
      '   ├─ [STEP 4] Computing witness and input variables...',
      '   │   └─ Loading input data for zero-knowledge proof under quantum isolation protocols.',
      '   │   └─ Extracting and validating 1.025 million quantum-state variables with AI anomaly detection.',
      '   │   └─ Witness computation finalized: 50 quadrillion operations executed with subatomic precision tracking.',
      '   │   └─ Data integrity certified via quantum-enhanced ECC with checksum: 23d8b9457e0c4f2e8a91e3f762de93bc.',
      '   │   └─ [OK] Witness and input computation encapsulated in quantum isolation for next phase.',
    ],
    [
      '   ├─ [STEP 5] Applying elliptic curve cryptography over BN-Quantum4096 curve...',
      '   │   └─ Executing scalar multiplications with 16,384-bit registers on superconducting quantum cores.',
      '   │   └─ Ensuring data isolation with quantum entanglement shielding for zero-disclosure assurance.',
      '   │   └─ Dual-spectrum monitoring applied to mitigate side-channel risks with photonic and neutrino surveillance.',
      '   │   └─ AI-audited redundancy checks confirm consistency across multi-spatial data flows.',
      '   │   └─ [OK] Elliptic curve operations completed. Quantum-AI encryption integrity maintained.',
    ],
    [
      '   ├─ [STEP 6] Generating proof using Groth-X64 protocol...',
      '   │   └─ Proof generation initialized with adaptive quantum seed verification.',
      '   │   └─ Multi-threaded execution deployed on 1,024,000 quantum cores, leveraging hyper-entangled nodes.',
      '   │   └─ Proof optimized to 64 qubytes with quantum-compressed entropy preservation.',
      '   │   └─ Performance verification: Delay checks passed, execution time 0.0000000000000034 seconds.',
      '   │   └─ Audit trails stored using cross-dimensional holographic signatures.',
      '   │   └─ [COMPLETE] Proof generated with zero knowledge maintained, safeguarded by Quantum-AI dual-state entanglement encryption.',
    ],
    [
      '   ├─ [STEP 7] Performing multi-layer bilinear pairing checks...',
      '   │   └─ Verifying e(P, Q) = e(G, H) with hyper-elliptic quantum matrix validation.',
      '   │   └─ Integrity checks reinforced with triple-redundant cryptographic protocols and AI temporal audits.',
      '   │   └─ Error tolerance recalibrated to < 10^-30 deviation. Verification set to 99.9999999999999% accuracy.',
      '   │   └─ Secured against differential fault analysis with tachyonic interference detection.',
      '   │   └─ [SUCCESS] Bilinear pairing verified with full compliance across spatial and temporal parameters.',
    ],
    [
      '   └─ [FINAL STATUS] Zero-Knowledge SNARK proof generated and verified.',
      '      └─ Proof encapsulated with Quantum-Resilient Neutrino Shield (QRNS) encryption for secure transfer.',
      '      └─ [SECURITY NOTICE] Classified at SEF/Q - Diver Eyes Only. Access limited to holographically registered personnel.',
      '      └─ Audit logs encrypted with Polyphasic Quantum Encryption (PQE) and stored in a zero-gravity vault. Temporal certification confirmed.',
    ]
  ];

  // Simulated quantum key generation output
  const generateQuantumKeyOutput = (): string[][] => [
    [
      '>> Initializing CRYSTALS-Kyber1024 Key Generation',
      '   ├─ Generating random seed from quantum entropy source',
      '   ├─ Computing lattice-based public parameters',
      '   ├─ Deriving polynomial ring elements',
      '   └─ Key pair generated successfully',
      '      ├─ Public Key: kyb1_pub_[truncated]...',
      '      └─ Private Key: [REDACTED]'
    ]
  ];

  // Simulated ZK-STARK proof generation
  const generateStarkProof = () => [
    '>> Initializing ZK-STARK Proof Generation',
    '   ├─ Computing arithmetic intermediate representation',
    '   ├─ Generating constraint system',
    '   ├─ Building merkle tree for FRI commitments',
    '   └─ Proof generated: stark_proof_[truncated]...'
  ];

  // Simulated quantum-resistant signature
  const generateDilithiumSignature = () => [
    '>> DILITHIUM3 Signature Protocol Initiated',
    '   ├─ Generating random nonce',
    '   ├─ Computing polynomial commitments',
    '   ├─ Applying Fiat-Shamir transform',
    '   └─ Signature verified: dil3_sig_[truncated]...'
  ];

  // Helper function to style messages
  const styleMessage = (message: string): string => {
    if (message.includes('[ERROR]')) return 'error-text';
    if (message.includes('[AUTH]')) return 'auth-text';
    if (message.includes('[OK]')) return 'success-text';
    if (message.includes('[STEP')) return 'step-text';
    if (message.includes('[INFO]')) return 'info-text';
    if (message.includes('[SECURITY]')) return 'security-text';
    if (message.startsWith('>>')) return 'command-text';
    return '';
  };

  // Simulate random error and retry
  const simulateErrorAndRetry = async (messages: string[]): Promise<string[]> => {
    // Random step to fail (avoiding first and last steps)
    const stepIndex = Math.floor(Math.random() * (messages.length - 2)) + 1;
    const errorMessage = '[ERROR] Quantum state decoherence detected. Initiating recovery...';
    const retryMessage = '[INFO] Reestablishing quantum coherence...';
    const successMessage = '[OK] Quantum state restored. Continuing authentication...';
    
    return [
      ...messages.slice(0, stepIndex),
      errorMessage,
      retryMessage,
      successMessage,
      ...messages.slice(stepIndex)
    ];
  };

  // Enhanced enter sequence focusing on the ZkSnark proof
  const enterSequence = [
    {
      cmd: '>> INITIALIZING SUPER EARTH QUANTUM AUTHENTICATION',
      output: [
        '[AUTH] Establishing connection to Super Earth Defense Network...',
        '[INFO] Quantum channel initialization in progress...',
        '[OK] Connection established - Quantum channel secured'
      ]
    },
    {
      cmd: '>> ACTIVATING QUANTUM-RESISTANT SECURITY LAYER',
      output: [
        '[INFO] Loading military-grade quantum security modules...',
        '   ├─ Module: Quantum Key Distribution (QKD)',
        '   ├─ Module: Post-Quantum Cryptography (PQC)',
        '   ├─ Module: Zero-Knowledge Authentication',
        '   └─ [OK] All security modules activated'
      ]
    },
    {
      cmd: '>> GENERATING ZERO-KNOWLEDGE AUTHENTICATION PROOF',
      output: generateZkSnarkProofOutput().map(section => section.map(line => 
        line
      )).flat()
    },
    {
      cmd: '>> FINALIZING AUTHENTICATION SEQUENCE',
      output: [
        '[INFO] Verifying quantum proof integrity...',
        '[OK] Proof verified with 99.9999999999999% confidence',
        '[INFO] Establishing secure session...',
        '[OK] Session established with quantum-resistant encryption',
        '[SUCCESS] AUTHENTICATION COMPLETE - WELCOME TO SUPER EARTH'
      ]
    }
  ];

  // Combat initialization sequence for exiting the system
  const exitSequence = [
    {
      cmd: ">> INITIALIZING A.D.A. NEURAL INTERFACE",
      output: [
        "ESTABLISHING QUANTUM LINK...",
        "[VERIFIED] METATRON CONNECTION ACTIVE",
        "JEHUTY PROTOCOL DELTA-7 ENGAGED"
      ]
    },
    {
      cmd: ">> SCANNING FOR TERMINID SIGNATURES",
      output: [
        "ANALYZING ORBITAL PATTERNS...",
        "CHECKING PLANETARY DEFENSE GRID...",
        "[ALERT] MULTIPLE BUG SIGNATURES DETECTED",
        "[CAUTION] AUTOMATED RESPONSE SYSTEMS ACTIVE"
      ]
    },
    {
      cmd: ">> LOADING SUPER EARTH COMBAT PROTOCOLS",
      output: [
        "ACCESSING HELLDIVER DATABASE...",
        "INITIALIZING ORBITAL STRIKE SYSTEMS...",
        "CALIBRATING STRATAGEM BEACONS...",
        "[VERIFIED] MANAGED DEMOCRACY ONLINE"
      ]
    },
    {
      cmd: ">> ESTABLISHING SUPER EARTH COMMAND LINK",
      output: [
        "SYNCHRONIZING WITH FLEET COMMAND...",
        "LOADING MISSION PARAMETERS...",
        "[VERIFIED] FOR DEMOCRACY!"
      ]
    },
    {
      cmd: ">> FINALIZING NEURAL SYNCHRONIZATION",
      output: [
        "OPTIMIZING COMBAT ALGORITHMS...",
        "LOADING BATTLEFIELD ANALYTICS...",
        "[SUCCESS] READY TO SPREAD MANAGED DEMOCRACY"
      ]
    }
  ];



  // Use the appropriate sequence based on mode
  $: bootSequence = mode === 'enter' ? enterSequence : exitSequence;

  // Enhanced smooth scroll with always-bottom behavior
  const smoothScrollToBottom = async () => {
    if (!terminalElement) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 0)); // Wait for DOM update
      const scrollTarget = terminalElement.scrollHeight - terminalElement.clientHeight;
      
      terminalElement.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
      });
    } catch (error) {
      console.error('Scroll error:', error);
    }
  };

  // Process messages with enhanced styling
  async function processBootSequence() {
    if (isProcessing) return;
    isProcessing = true;
    
    bootState.set({ terminalComplete: false, formVisible: false });
    visible = true;
    
    await sleep(150); // Quick initial delay
    
    for (const sequence of bootSequence) {
      if (!visible) break;
      
      // Command appears quickly
      messages = [...messages, sequence.cmd];
      await sleep(50);
      smoothScrollToBottom();
      
      if (sequence.output.length > 0) {
        let outputLines = sequence.output;
        
        // 20% chance of error simulation
        if (Math.random() < 0.2) {
          outputLines = await simulateErrorAndRetry(outputLines);
        }
        
        for (const line of outputLines) {
          if (!visible) break;
          messages = [...messages, line];
          
          const delay = 
            line.includes('[ERROR]') ? 75 :
            line.includes('[AUTH]') ? 50 :
            line.includes('[OK]') ? 50 :
            line.includes('[STEP') ? 25 :
            25;
          
          await sleep(delay);
          smoothScrollToBottom();
        }
      }
      
      currentIndex++;
      progress = (currentIndex / bootSequence.length) * 100;
      
      // Pause briefly between major sections
      await sleep(50);
    }

    await sleep(125);
    onComplete();
    await sleep(75);
    visible = false;
    isProcessing = false;
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  onMount(() => {
    console.log('TerminalText mounted');
    processBootSequence();
  });

  onDestroy(() => {
    console.log('TerminalText destroyed');
    isProcessing = false;
    visible = false;
  });

  // Auto-scroll when messages update
  $: if (messages.length) {
    setTimeout(smoothScrollToBottom, 50);
  }
</script>

<div 
  class="terminal-container quantum-theme fixed inset-0 m-4 z-50"
  class:combat-theme={mode === 'exit'}
  transition:fade={{ duration: 300 }}
>
  <div class="terminal-frame h-full flex flex-col">
    <div 
      class="terminal-content custom-scrollbar flex-1 overflow-y-auto"
      bind:this={terminalElement}
    >
      {#each messages as message}
        <div 
          class="message-line {styleMessage(message)}"
        >
          {message}
        </div>
      {/each}
      {#if visible}
        <div class="message-line blink">_</div>
      {/if}
    </div>
  </div>
  
  <div class="progress-bar">
    <div 
      class="progress-fill"
      style="width: {progress}%"
    />
  </div>
</div>

<style>
  .terminal-container {
    background: rgba(0, 0, 0, 0.95);
    font-family: monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    color: #00FF00;
    display: flex;
    flex-direction: column;
  }

  .terminal-frame {
    border: 1px solid rgba(255, 215, 0, 0.3);
    padding: 1rem;
    position: relative;
    overflow: hidden;
  }

  .terminal-content {
    padding: 1rem;
    line-height: 1.5;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 215, 0, 0.3) rgba(255, 215, 0, 0.1);
  }

  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(
      transparent 50%,
      rgba(255, 215, 0, 0.025) 50%
    );
    background-size: 100% 4px;
    animation: scan 10s linear infinite;
    pointer-events: none;
  }

  @keyframes scan {
    0% { transform: translateY(0); }
    100% { transform: translateY(30px); }
  }

  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(255, 215, 0, 0.2);
    z-index: 20;
  }

  .progress-fill {
    height: 100%;
    background: #FFD700;
    transition: width 0.3s ease;
    box-shadow: 0 0 10px #FFD700;
  }

  .message-line {
    opacity: 0;
    animation: fadeIn 0.3s ease-out forwards;
  }

  .command-text {
    color: #00FF00;
    font-weight: bold;
  }

  .alert-text {
    color: #FF4444;
    font-weight: bold;
  }

  .caution-text {
    color: #FFA500;
    font-weight: bold;
  }

  .success-text {
    color: #00FF00;
    font-weight: bold;
  }

  @keyframes fadeIn {
    from { 
      opacity: 0;
      transform: translateY(5px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }

  .blink {
    animation: blink 1s step-end infinite;
    color: #FFD700;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 215, 0, 0.1);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 2px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 215, 0, 0.5);
  }

  /* Theme-specific styles */
  .quantum-theme {
    border-color: rgba(0, 255, 255, 0.3);
    text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  }

  .quantum-theme .terminal-frame {
    border-color: rgba(0, 255, 255, 0.3);
  }

  .quantum-theme .terminal-frame::before,
  .quantum-theme .terminal-frame::after {
    border-color: #0FF;
  }

  .combat-theme {
    border-color: rgba(255, 215, 0, 0.3);
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }

  .error-text {
    color: #FF4444;
    font-weight: bold;
  }

  .auth-text {
    color: #B19CD9;
    font-weight: bold;
  }

  .step-text {
    color: #FFD700;
  }

  .info-text {
    color: #00FFFF;
  }

  .security-text {
    color: #FF4444;
    font-weight: bold;
  }

  /* Animation for error messages */
  .error-text {
    animation: errorFlash 0.5s ease-in-out;
  }

  @keyframes errorFlash {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
</style> 