"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";


export type ThreeSceneProps = {
    background?: string; // unused when rendering only the model; kept for API compatibility
    objectColor?: string; // unused when rendering only the model; kept for API compatibility
    className?: string;
    modelPath?: string; // path to GLB model to render
    noLights?: boolean; // render only the model without any lights
    scrollProgress?: number; // scroll progress from 0 to 1 for animations
    enableScrollAnimation?: boolean; // enable scroll-based animations
    autoRotate?: boolean; // enable automatic rotation
    rotationSpeed?: number; // rotation speed multiplier (default: 0.5)
    semiRotate?: boolean; // enable semi-rotation (oscillating back and forth)
    zoomOnScroll?: boolean; // enable camera zoom based on scroll
    minDistance?: number; // closest camera distance
    maxDistance?: number; // farthest camera distance
    scaleMultiplier?: number; // additional scale factor for the model size
    initialRotation?: [number, number, number]; // initial rotation for the model (radians)
    opacity?: number; // opacity for the model (0 to 1)
    onModelReady?: (modelPath: string) => void; // callback when the model has finished loading
};

function NormalizedModel({ 
    path, 
    noLights = false, 
    scrollProgress = 0,
    enableScrollAnimation = false,
    autoRotate = true,
    rotationSpeed = 0.5,
    semiRotate = false,
    scaleMultiplier = 1,
    initialRotation = [0, 0, 0],
    opacity = 1,
    onModelReady,
}: { 
    path: string; 
    noLights?: boolean;
    scrollProgress?: number;
    enableScrollAnimation?: boolean;
    autoRotate?: boolean;
    rotationSpeed?: number;
    semiRotate?: boolean;
    scaleMultiplier?: number;
    initialRotation?: [number, number, number];
    opacity?: number;
    onModelReady?: (modelPath: string) => void;
}) {
    const { gl } = useThree();
    
    // Suppress texture loading errors from GLTFLoader (we handle missing textures gracefully)
    useEffect(() => {
        const originalError = console.error;
        console.error = (...args: unknown[]) => {
            // Filter out texture loading errors from GLTFLoader
            const message = args.join(' ');
            if (typeof message === 'string' && message.includes('THREE.GLTFLoader: Couldn\'t load texture')) {
                // Suppress this specific error - we handle missing textures in material processing
                return;
            }
            // Pass through all other errors
            originalError.apply(console, args);
        };
        
        return () => {
            console.error = originalError;
        };
    }, []);
    
    // Load GLTF - errors will be handled at material/texture level
    const gltf = useGLTF(path);
    const root = gltf?.scene as THREE.Object3D;
    const groupRef = useRef<THREE.Group>(null);
    const baseRotationRef = useRef<THREE.Euler>(new THREE.Euler(initialRotation[0], initialRotation[1], initialRotation[2]));
    const finalRotationRef = useRef<number | null>(null);
    const hasReachedFinalRef = useRef(false);
    const currentRotationRef = useRef<number | null>(null); // Preserve current rotation during resize
    const timeRef = useRef<number>(0); // Time accumulator for semi-rotation
    const hasReportedReadyRef = useRef(false);

    useEffect(() => {
        if (!onModelReady) return;
        if (!path) return;
        if (!gltf) return;
        if (hasReportedReadyRef.current) return;

        hasReportedReadyRef.current = true;
        onModelReady(path);
    }, [gltf, onModelReady, path]);

    // Get max anisotropy from renderer capabilities
    const maxAnisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy());

    // Process textures from GLTF loader directly to ensure high quality
    useEffect(() => {
        if (!gltf) return;
        
                    // Helper function to set high-quality texture filtering
                    const setTextureQuality = (texture: THREE.Texture | null | undefined) => {
                        if (!texture) return;
                        texture.colorSpace = THREE.SRGBColorSpace;
                        texture.minFilter = THREE.LinearMipmapLinearFilter;
                        texture.magFilter = THREE.LinearFilter;
                        texture.generateMipmaps = true;
                        // Prevent texture downscaling - ensure full resolution
                        if (texture.image) {
                            texture.userData.originalSize = {
                                width: texture.image.width,
                                height: texture.image.height
                            };
                            // Ensure image is not compressed
                            if (texture.image instanceof Image || texture.image instanceof HTMLImageElement) {
                                // Don't compress the image
                                texture.flipY = false; // Some models need this
                            }
                        }
                        // Enable anisotropic filtering for better quality
                        if (texture.anisotropy !== undefined) {
                            texture.anisotropy = maxAnisotropy;
                        }
                        // Force texture update to apply settings
                        texture.needsUpdate = true;
                        // Ensure texture is not downscaled by renderer
                        texture.format = THREE.RGBAFormat;
                    };

        // Traverse the scene to process textures in materials
        if (gltf.scene) {
            gltf.scene.traverse((child: THREE.Object3D) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;
                    const material = mesh.material;
                    
                    type MaterialWithTextures = THREE.Material & {
                        map?: THREE.Texture | null;
                        normalMap?: THREE.Texture | null;
                        roughnessMap?: THREE.Texture | null;
                        metalnessMap?: THREE.Texture | null;
                        aoMap?: THREE.Texture | null;
                        emissiveMap?: THREE.Texture | null;
                        alphaMap?: THREE.Texture | null;
                    }

                    const processTexture = (texture: THREE.Texture | null | undefined, name: string) => {
                        if (texture && texture.isTexture) {
                            setTextureQuality(texture);
                            // Log texture resolution for debugging
                            if (texture.image) {
                                const width = texture.image.width || (texture.image as HTMLVideoElement).videoWidth || 0;
                                const height = texture.image.height || (texture.image as HTMLVideoElement).videoHeight || 0;
                                if (width > 0 && height > 0) {
                                    console.log(`Texture ${name || mesh.name || 'unknown'}: ${width}x${height}`);
                                }
                            }
                        }
                    };
                    
                    if (Array.isArray(material)) {
                        material.forEach((mat) => {
                            if (mat) {
                                const materialWithTextures = mat as MaterialWithTextures;
                                if (materialWithTextures.map) processTexture(materialWithTextures.map, `map-${mesh.name || 'mesh'}`);
                                if (materialWithTextures.normalMap) processTexture(materialWithTextures.normalMap, `normal-${mesh.name || 'mesh'}`);
                                if (materialWithTextures.roughnessMap) processTexture(materialWithTextures.roughnessMap, `roughness-${mesh.name || 'mesh'}`);
                                if (materialWithTextures.metalnessMap) processTexture(materialWithTextures.metalnessMap, `metalness-${mesh.name || 'mesh'}`);
                                if (materialWithTextures.aoMap) processTexture(materialWithTextures.aoMap, `ao-${mesh.name || 'mesh'}`);
                                if (materialWithTextures.emissiveMap) processTexture(materialWithTextures.emissiveMap, `emissive-${mesh.name || 'mesh'}`);
                                if (materialWithTextures.alphaMap) processTexture(materialWithTextures.alphaMap, `alpha-${mesh.name || 'mesh'}`);
                            }
                        });
                    } else if (material) {
                        const mat = material as MaterialWithTextures;
                        if (mat.map) processTexture(mat.map, `map-${mesh.name || 'mesh'}`);
                        if (mat.normalMap) processTexture(mat.normalMap, `normal-${mesh.name || 'mesh'}`);
                        if (mat.roughnessMap) processTexture(mat.roughnessMap, `roughness-${mesh.name || 'mesh'}`);
                        if (mat.metalnessMap) processTexture(mat.metalnessMap, `metalness-${mesh.name || 'mesh'}`);
                        if (mat.aoMap) processTexture(mat.aoMap, `ao-${mesh.name || 'mesh'}`);
                        if (mat.emissiveMap) processTexture(mat.emissiveMap, `emissive-${mesh.name || 'mesh'}`);
                        if (mat.alphaMap) processTexture(mat.alphaMap, `alpha-${mesh.name || 'mesh'}`);
                    }
                }
            });
        }
    }, [gltf, maxAnisotropy]);

    const model = useMemo(() => {
        const source = root || new THREE.Group();
        if (!source) {
            return new THREE.Group();
        }
        const cloned = source.clone(true);

        cloned.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = false;
                mesh.receiveShadow = false;
                // Material handling: if noLights, use MeshBasicMaterial so it's visible without lights
                if (noLights) {
                    // Helper function to set high-quality texture filtering
                    const setTextureQuality = (texture: THREE.Texture | null | undefined) => {
                        if (!texture) return;
                        texture.colorSpace = THREE.SRGBColorSpace;
                        texture.minFilter = THREE.LinearMipmapLinearFilter;
                        texture.magFilter = THREE.LinearFilter;
                        texture.generateMipmaps = true;
                        // Ensure texture format is not compressed
                        texture.format = THREE.RGBAFormat;
                        // Enable anisotropic filtering for better quality
                        if (texture.anisotropy !== undefined) {
                            texture.anisotropy = maxAnisotropy;
                        }
                        // Force texture update
                        texture.needsUpdate = true;
                    };

                    type MaterialWithProperties = THREE.Material & {
                        color?: THREE.Color;
                        transparent?: boolean;
                        opacity?: number;
                        side?: THREE.Side;
                        map?: THREE.Texture | null;
                        alphaMap?: THREE.Texture | null;
                    }

                    const toBasic = (mat: THREE.Material | null | undefined) => {
                        const asMat = (mat || {}) as MaterialWithProperties;
                        const basic = new THREE.MeshBasicMaterial({
                            color: asMat.color || new THREE.Color("#ffffff"),
                            transparent: !!asMat.transparent,
                            opacity: typeof asMat.opacity === "number" ? asMat.opacity : 1,
                            side: asMat.side ?? THREE.FrontSide,
                        });
                        if (asMat.map) {
                            setTextureQuality(asMat.map);
                            basic.map = asMat.map;
                        }
                        if (asMat.alphaMap) {
                            setTextureQuality(asMat.alphaMap);
                            basic.alphaMap = asMat.alphaMap;
                        }
                        return basic;
                    };
                    if (Array.isArray(mesh.material)) {
                        mesh.material = mesh.material.map((m) => toBasic(m));
                    } else {
                        mesh.material = toBasic(mesh.material as THREE.Material | undefined);
                    }
                } else {
                    // Helper function to set high-quality texture filtering
                    const setTextureQuality = (texture: THREE.Texture | null | undefined) => {
                        if (!texture) return;
                        texture.colorSpace = THREE.SRGBColorSpace;
                        texture.minFilter = THREE.LinearMipmapLinearFilter;
                        texture.magFilter = THREE.LinearFilter;
                        texture.generateMipmaps = true;
                        // Ensure texture format is not compressed
                        texture.format = THREE.RGBAFormat;
                        // Enable anisotropic filtering for better quality
                        if (texture.anisotropy !== undefined) {
                            texture.anisotropy = maxAnisotropy;
                        }
                        // Force texture update
                        texture.needsUpdate = true;
                    };

                    // Helper to safely check if texture is valid (not a missing texture error)
                    const isValidTexture = (texture: THREE.Texture | null | undefined): boolean => {
                        if (!texture) return false;
                        // Check if texture has an error or is missing
                        if ((texture as { error?: unknown }).error || texture.image === null || texture.image === undefined) {
                            return false;
                        }
                        // Check if image is valid (not a placeholder)
                        if (texture.image && (texture.image.width === 0 || texture.image.height === 0)) {
                            return false;
                        }
                        return true;
                    };

                    type MaterialForConversion = THREE.Material & {
                        type?: string;
                        color?: THREE.Color;
                        map?: THREE.Texture | null;
                        normalMap?: THREE.Texture | null;
                        roughnessMap?: THREE.Texture | null;
                        metalnessMap?: THREE.Texture | null;
                        aoMap?: THREE.Texture | null;
                        emissiveMap?: THREE.Texture | null;
                        alphaMap?: THREE.Texture | null;
                        roughness?: number;
                        metalness?: number;
                        transparent?: boolean;
                        opacity?: number;
                        side?: THREE.Side;
                        emissive?: THREE.Color;
                        emissiveIntensity?: number;
                        dispose?: () => void;
                        isMaterial?: boolean;
                    }

                    // Convert all materials to MeshStandardMaterial for consistent PBR rendering
                    const convertToStandard = (mat: THREE.Material | null | undefined): THREE.MeshStandardMaterial => {
                        if (!mat || !(mat as MaterialForConversion).isMaterial) {
                            return new THREE.MeshStandardMaterial({ color: "#cccccc" });
                        }
                        
                        const asMat = mat as MaterialForConversion;
                        const isPhong = asMat.type === "MeshPhongMaterial";
                        const isBasic = asMat.type === "MeshBasicMaterial";
                        const isLambert = asMat.type === "MeshLambertMaterial";
                        
                        // Get color from material or use default
                        const materialColor = asMat.color ? (asMat.color.clone ? asMat.color.clone() : asMat.color) : new THREE.Color("#cccccc");
                        
                        // Only use textures if they're valid (not missing)
                        const validMap = isValidTexture(asMat.map) ? asMat.map : null;
                        const validNormalMap = isValidTexture(asMat.normalMap) ? asMat.normalMap : null;
                        const validRoughnessMap = isValidTexture(asMat.roughnessMap) ? asMat.roughnessMap : null;
                        const validMetalnessMap = isValidTexture(asMat.metalnessMap) ? asMat.metalnessMap : null;
                        const validAoMap = isValidTexture(asMat.aoMap) ? asMat.aoMap : null;
                        const validEmissiveMap = isValidTexture(asMat.emissiveMap) ? asMat.emissiveMap : null;
                        
                        // Convert Phong, Basic, Lambert, or unknown materials to Standard
                        if (isPhong || isBasic || isLambert || !asMat.roughness) {
                            const newMat = new THREE.MeshStandardMaterial({
                                color: materialColor,
                                map: validMap,
                                normalMap: validNormalMap,
                                roughnessMap: validRoughnessMap,
                                metalnessMap: validMetalnessMap,
                                aoMap: validAoMap,
                                emissiveMap: validEmissiveMap,
                                roughness: isBasic ? 1.0 : 0.6,
                                metalness: isBasic ? 0.0 : 0.2,
                                transparent: asMat.transparent || false,
                                opacity: asMat.opacity !== undefined ? asMat.opacity : 1,
                                side: asMat.side || THREE.FrontSide,
                                emissive: asMat.emissive ? (asMat.emissive.clone ? asMat.emissive.clone() : asMat.emissive) : new THREE.Color("#000000"),
                                emissiveIntensity: asMat.emissiveIntensity || 0,
                            });
                            
                            // Set high-quality filtering for all valid texture maps
                            if (validMap) setTextureQuality(newMat.map);
                            if (validNormalMap) setTextureQuality(newMat.normalMap);
                            if (validRoughnessMap) setTextureQuality(newMat.roughnessMap);
                            if (validMetalnessMap) setTextureQuality(newMat.metalnessMap);
                            if (validAoMap) setTextureQuality(newMat.aoMap);
                            if (validEmissiveMap) setTextureQuality(newMat.emissiveMap);
                            
                            // Dispose old material to prevent memory leaks
                            if (asMat.dispose) asMat.dispose();
                            
                            return newMat;
                        }
                        
                        // Already a Standard material, just ensure properties are set and textures have high quality
                        // Replace invalid textures with null
                        if (asMat.map && !isValidTexture(asMat.map)) asMat.map = null;
                        if (asMat.normalMap && !isValidTexture(asMat.normalMap)) asMat.normalMap = null;
                        if (asMat.roughnessMap && !isValidTexture(asMat.roughnessMap)) asMat.roughnessMap = null;
                        if (asMat.metalnessMap && !isValidTexture(asMat.metalnessMap)) asMat.metalnessMap = null;
                        if (asMat.aoMap && !isValidTexture(asMat.aoMap)) asMat.aoMap = null;
                        if (asMat.emissiveMap && !isValidTexture(asMat.emissiveMap)) asMat.emissiveMap = null;
                        
                        // Only set quality for valid textures
                        if (asMat.map) setTextureQuality(asMat.map);
                        if (asMat.normalMap) setTextureQuality(asMat.normalMap);
                        if (asMat.roughnessMap) setTextureQuality(asMat.roughnessMap);
                        if (asMat.metalnessMap) setTextureQuality(asMat.metalnessMap);
                        if (asMat.aoMap) setTextureQuality(asMat.aoMap);
                        if (asMat.emissiveMap) setTextureQuality(asMat.emissiveMap);
                        
                        if (typeof asMat.roughness !== "number") asMat.roughness = 0.6;
                        if (typeof asMat.metalness !== "number") asMat.metalness = 0.2;
                        
                        return asMat as THREE.MeshStandardMaterial;
                    };
                    
                    if (!Array.isArray(mesh.material)) {
                        mesh.material = convertToStandard(mesh.material);
                    } else {
                        mesh.material = mesh.material.map((m) => convertToStandard(m));
                    }
                }
            }
        });

        const box = new THREE.Box3().setFromObject(cloned);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxSide = Math.max(size.x, size.y, size.z) || 1;
        const targetSize = 2.2;
        const scale = (targetSize / maxSide) * scaleMultiplier;
        cloned.scale.setScalar(scale);

        const center = new THREE.Vector3();
        box.getCenter(center);
        cloned.position.sub(center.multiplyScalar(scale));

        return cloned;
    }, [root, scaleMultiplier, maxAnisotropy, noLights]);

    // Initialize current rotation from scrollProgress on mount only
    useEffect(() => {
        if (groupRef.current && enableScrollAnimation && scrollProgress !== undefined && currentRotationRef.current === null) {
            // Initialize rotation state based on scrollProgress only on first mount
            const targetRotation = baseRotationRef.current.y + scrollProgress * Math.PI * 4;
            currentRotationRef.current = targetRotation;
            if (groupRef.current) {
                groupRef.current.rotation.y = targetRotation;
            }
        }
    }, [enableScrollAnimation, scrollProgress]); // Include scrollProgress to satisfy exhaustive-deps

    // Combined animation frame for all rotations and position updates - optimized for performance
    useFrame((_state, delta) => {
        if (!groupRef.current) return;

        groupRef.current.position.z = 0;

        if (enableScrollAnimation && scrollProgress !== undefined) {
            // Smooth transition to final rotation [0, 0, 0]
            // Start transitioning from 0.85 to 1.0 for smooth interpolation
            const transitionStart = 0.85;
            const transitionEnd = 1.0;
            
            if (scrollProgress >= transitionStart) {
                // Calculate smooth interpolation factor (0 to 1)
                const t = Math.min(1.0, (scrollProgress - transitionStart) / (transitionEnd - transitionStart));
                // Smooth easing function for natural transition (ease-out cubic)
                const smoothT = 1 - Math.pow(1 - t, 3);
                
                // Calculate scroll-based rotation (before transition)
                const rotationAmount = transitionStart * 12.566370614359172; // Math.PI * 4 precomputed
                const scrollRotation = baseRotationRef.current.y + rotationAmount;
                
                // Interpolate X rotation from base to 0
                const currentX = baseRotationRef.current.x;
                groupRef.current.rotation.x = currentX * (1 - smoothT);
                
                // Interpolate Y rotation from scroll rotation to 0
                // Normalize Y rotation to closest equivalent of 0 (handle full rotations)
                let normalizedY = scrollRotation % (Math.PI * 2);
                if (normalizedY > Math.PI) {
                    normalizedY = normalizedY - Math.PI * 2;
                } else if (normalizedY < -Math.PI) {
                    normalizedY = normalizedY + Math.PI * 2;
                }
                // Smoothly interpolate from normalized Y to 0
                groupRef.current.rotation.y = normalizedY * (1 - smoothT);
                currentRotationRef.current = groupRef.current.rotation.y;
                
                // Interpolate Z rotation from base to 0
                const currentZ = baseRotationRef.current.z;
                groupRef.current.rotation.z = currentZ * (1 - smoothT);
            } else {
                // Reset the flag if we scroll back
                if (hasReachedFinalRef.current) {
                    hasReachedFinalRef.current = false;
                    finalRotationRef.current = null;
                }
                // Scroll-based rotation (full rotation as element scrolls through viewport)
                // 4x rotation: 4 * 2π = 8π over full scroll progress
                // Cache calculation to avoid repeated Math.PI * 4 multiplication
                const rotationAmount = scrollProgress * 12.566370614359172; // Math.PI * 4 precomputed
                const targetRotation = baseRotationRef.current.y + rotationAmount;
                groupRef.current.rotation.y = targetRotation;
                currentRotationRef.current = targetRotation;
                // Maintain base rotation for x and z during scroll
                groupRef.current.rotation.x = baseRotationRef.current.x;
                groupRef.current.rotation.z = baseRotationRef.current.z;
            }
            // Keep position centered vertically; wrapper handles Y translation
            groupRef.current.position.y = 0;
            // Keep scale constant
            groupRef.current.scale.setScalar(1);
        } else if (autoRotate) {
            // Auto-rotation when scroll animation is disabled
            if (semiRotate) {
                // Semi-rotation: oscillate between -30 and +30 degrees (approximately -0.52 to +0.52 radians)
                timeRef.current += delta * rotationSpeed; // Accumulate time
                const oscillationRange = 0.52; // ~30 degrees in radians
                const oscillation = Math.sin(timeRef.current) * oscillationRange;
                groupRef.current.rotation.y = baseRotationRef.current.y + oscillation;
                currentRotationRef.current = groupRef.current.rotation.y;
            } else {
                // Continuous rotation
                groupRef.current.rotation.y = baseRotationRef.current.y + (groupRef.current.rotation.y - baseRotationRef.current.y) + delta * rotationSpeed;
                currentRotationRef.current = groupRef.current.rotation.y;
            }
            // Reset position
            groupRef.current.position.y = 0;
            // Keep scale constant
            groupRef.current.scale.setScalar(1);
        } else {
            // No animations - just rotation
            groupRef.current.rotation.y = baseRotationRef.current.y;
            currentRotationRef.current = groupRef.current.rotation.y;
            groupRef.current.position.y = 0;
            // Keep scale constant
            groupRef.current.scale.setScalar(1);
        }
    });

    // Update opacity of all meshes in the model
    useEffect(() => {
        if (!groupRef.current) return;
        
        // Always keep group visible, control opacity through materials
        groupRef.current.visible = true;
        
        type MaterialWithOpacity = THREE.Material & {
            opacity?: number;
            transparent?: boolean;
            needsUpdate?: boolean;
        }

        groupRef.current.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((mat) => {
                        if (mat) {
                            const materialWithOpacity = mat as MaterialWithOpacity;
                            materialWithOpacity.opacity = opacity;
                            materialWithOpacity.transparent = opacity < 1;
                            // Ensure material updates
                            materialWithOpacity.needsUpdate = true;
                        }
                    });
                } else if (mesh.material) {
                    const materialWithOpacity = mesh.material as MaterialWithOpacity;
                    materialWithOpacity.opacity = opacity;
                    materialWithOpacity.transparent = opacity < 1;
                    // Ensure material updates
                    materialWithOpacity.needsUpdate = true;
                }
            }
        });
    }, [opacity, model]);

    return (
        <group ref={groupRef}>
            <primitive object={model} />
        </group>
    );
}

function CameraZoom({ enabled, scrollProgress = 0, minDistance = 3, maxDistance = 6 }: { enabled: boolean; scrollProgress?: number; minDistance?: number; maxDistance?: number }) {
    const { camera } = useThree();
    useFrame(() => {
        if (!enabled) return;
        const t = Math.max(0, Math.min(1, scrollProgress ?? 0));
        const targetZ = maxDistance + (minDistance - maxDistance) * t; // lerp
        camera.position.z = targetZ;
        camera.updateProjectionMatrix();
    });
    return null;
}

export default function ThreeScene({
    background: _background = "#0a0a0a", // eslint-disable-line @typescript-eslint/no-unused-vars
    objectColor: _objectColor = "#22c55e", // eslint-disable-line @typescript-eslint/no-unused-vars
    className,
    modelPath,
    noLights,
    scrollProgress = 0,
    enableScrollAnimation = false,
    autoRotate = true,
    rotationSpeed = 0.5,
    semiRotate = false,
    zoomOnScroll = false,
    minDistance = 3,
    maxDistance = 6,
    scaleMultiplier = 1,
    initialRotation = [0, 0, 0],
    opacity = 1,
    onModelReady,
}: ThreeSceneProps) {
	return (
        <div className={className} style={{ width: "100%", height: "100%" }}>
                <Canvas
                    shadows={false}
                    camera={{ position: [0, 0, 4.5], fov: 45 }}
                    gl={{ 
                        alpha: true,
                        antialias: false,
                        powerPreference: "high-performance",
                        preserveDrawingBuffer: false,
                        stencil: false,
                        depth: true,
                    }}
                    dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1} // Lower DPR for better performance
                    frameloop="always"
                    onCreated={({ gl, camera }) => {
                        gl.outputColorSpace = THREE.SRGBColorSpace;
                        // Ensure physically based lighting pipeline
                        // @ts-expect-error - not in type defs for some versions
                        gl.physicallyCorrectLights = true;
                        gl.toneMapping = THREE.ACESFilmicToneMapping;
                        gl.toneMappingExposure = 1.0;
                        // Ensure camera updates for better quality
                        camera.updateProjectionMatrix();
                    }}
                >
                    {/* Balanced lights for better model look when lights are enabled */}
                    {!noLights && (
                        <>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[5, 5, 5]} intensity={1.0} castShadow={false} />
                            <hemisphereLight intensity={0.4} groundColor={new THREE.Color("#111111")} />
                        </>
                    )}
                    {modelPath && (
                        <Suspense fallback={null}>
                            <NormalizedModel 
                                path={modelPath} 
                                noLights={!!noLights}
                                scrollProgress={scrollProgress}
                                enableScrollAnimation={enableScrollAnimation}
                                autoRotate={autoRotate}
                                rotationSpeed={rotationSpeed}
                                semiRotate={semiRotate}
                                scaleMultiplier={scaleMultiplier}
                                initialRotation={initialRotation}
                                opacity={opacity}
                                onModelReady={onModelReady}
                            />
                        </Suspense>
                    )}
                    <CameraZoom 
                        enabled={!!(enableScrollAnimation && zoomOnScroll)} 
                        scrollProgress={scrollProgress}
                        minDistance={minDistance}
                        maxDistance={maxDistance}
                    />
                </Canvas>
        </div>
	);
}



