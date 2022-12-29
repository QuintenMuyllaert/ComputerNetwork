<script lang="ts">
    import { bestImageFileFormatThisBrowserSupports} from "../utils/imageformat";
    import { isBrowser } from "../utils/globals";

    export let src: string;
    export let alt: string;
    export let loading: "lazy" | "eager" = "lazy";

    const commonSizes = [
        64,128,256,512,1024,2048,4096
    ]

    let format = "";
    $:if(isBrowser) format = bestImageFileFormatThisBrowserSupports();
</script>

<picture>
        {#each commonSizes as size}
            <source srcset="{src}?width={size}&format={format}&quality={80}" media="(min-width: {size}px)" >
        {/each}
    <img src={src} alt={alt} style="width:auto;" loading={loading}>
</picture>

<style lang="scss" scoped>
    picture {
        display: block;
        width: 100%;
        height: 100%;
        background-color: #000;
    }
</style>